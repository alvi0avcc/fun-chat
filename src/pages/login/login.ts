import './login.css';
import gear from '../../assets/gear.svg';

import * as html from '../../builder/elements';
import { wSocket } from '../../websockets/websocket';
import { dlgServerSelect } from '../../websockets/server-select';

interface User {
  login: string | undefined;
  pwd: string | undefined;
}

const minLength = 4;
const maxLength = 15;

export class Login {
  private main: HTMLElement | undefined;
  private currentServerLabel: HTMLLabelElement = document.createElement('label');
  private user: User;
  private loginBtn: HTMLButtonElement;
  private aboutBtn: HTMLAnchorElement;
  private nameInput: HTMLInputElement = document.createElement('input');
  private pwdInput: HTMLInputElement = document.createElement('input');

  constructor() {
    this.main = undefined;
    this.user = { login: undefined, pwd: undefined };
    this.loginBtn = html.button({
      text: 'Login',
      disabled: true,
      callback: () => {
        if (this.user.login && this.user.pwd)
          wSocket.login(this.user.login, this.user.pwd).then((response) => {
            console.log('login result =', response);
            if (response?.result) {
              globalThis.location.href = '#/chat';
            }
            if (response?.message === 'incorrect password') {
              console.log('incorrect password');
              messageWrongPassword(response?.message);
            }
          });
      },
    });
    this.aboutBtn = html.a({
      text: 'About',
      href: '/about',
      attributes: { 'data-router-link': '' },
      styles: ['button'],
    });
    this.initBtnNamePwd();
  }

  public setCurrentServerLabel(): void {
    this.currentServerLabel.textContent = wSocket.getUrl;
  }

  public getView(): HTMLElement {
    return this.main ?? document.createElement('div');
  }

  public async init(): Promise<void> {
    if (!this.main) {
      this.main = html.section({
        id: 'main',
        tag: 'main',
        styles: ['main'],
        children: [this.loginForm()],
      });
      // wSocket.create();
    }
  }

  private initBtnNamePwd(): void {
    this.nameInput = html.input({
      id: 'login',
      type: 'text',
      placeholder: 'User Name',
      title: `Name (${minLength} to ${maxLength} letters required)`,
      attributes: { minlength: `${minLength}`, maxlength: `${maxLength}`, require: '' },
      eventType: 'input',
      callback: (event) => {
        console.log(event);
        this.user.login = inputValue(event, minLength, maxLength);
        this.loginBtn.disabled = this.user.login && this.user.pwd ? false : true;
      },
    });

    this.nameInput.addEventListener('keydown', (event: KeyboardEvent) => {
      if (this.checkEnter(event.key)) this.loginBtn.click();
    });

    this.pwdInput = html.input({
      id: 'passwd',
      type: 'password',
      placeholder: 'Password',
      title: `Password (${minLength} to ${maxLength} letters required)`,
      attributes: { minlength: `${minLength}`, maxlength: `${maxLength}`, require: '' },
      eventType: 'input',
      callback: (event) => {
        console.log(event);
        this.user.pwd = inputValue(event, minLength, maxLength);
        this.loginBtn.disabled = this.user.login && this.user.pwd ? false : true;
      },
    });

    this.pwdInput.addEventListener('keydown', (event: KeyboardEvent) => {
      if (this.checkEnter(event.key)) this.loginBtn.click();
    });
  }

  private loginForm(): HTMLElement {
    return html.section({
      id: 'login-form',
      tag: 'form',
      children: [
        html.section({
          id: 'current-server-info',
          styles: ['section', 'current-server-info'],
          children: [
            this.currentServerLabel,
            html.button({
              styles: ['settings'],
              children: [html.img({ source: gear })],
              attributes: { title: 'Click for select server' },
              callback: () => {
                dlgServerSelect();
              },
            }),
          ],
        }),
        html.section({
          tag: 'fieldset',
          children: [
            html.section({ tag: 'legend', text: 'Authorization' }),
            html.label({ text: 'Login', htmlFor: 'login' }),
            this.nameInput,
            html.label({ text: 'Password', htmlFor: 'passwd' }),
            this.pwdInput,
          ],
        }),
        html.section({
          tag: 'div',
          styles: ['form-btn'],
          children: [this.loginBtn, this.aboutBtn],
        }),
      ],
    });
  }

  private checkEnter(key: string): boolean {
    if (
      key === 'Enter' &&
      this.user.login &&
      this.user.pwd &&
      this.user.login.length >= minLength &&
      this.user.login.length <= maxLength &&
      this.user.pwd.length >= minLength &&
      this.user.pwd.length <= maxLength
    )
      return true;
    return false;
  }
}

export const login = new Login();

//---------------------------------------

const inputValue = (data: Event, min = 4, max = 15): string | undefined => {
  const result: string = data.target instanceof HTMLInputElement ? data.target.value : '';
  if (result.length >= min && result.length <= max) return result;
  return undefined;
};

const messageWrongPassword = (message: string): void => {
  const dlg: HTMLDialogElement = html.dialog({
    styles: ['dialog', 'dialog-wrong-pwd'],
    children: [
      html.h({ tag: 'h3', text: message }),
      html.button({
        type: 'reset',
        text: 'OK',
        callback: () => dlg.close(),
      }),
    ],
  });

  dlg.addEventListener('close', () => dlg.remove());

  document.body.append(dlg);
  dlg.showModal();
};
