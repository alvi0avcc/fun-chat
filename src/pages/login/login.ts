import './login.css';
import gear from '../../assets/gear.svg';

import * as html from '../../builder/elements';
import type { LoginResult } from '../../websockets/websocket';
import { wSocket } from '../../websockets/websocket';
import { dlgServerSelect } from '../../websockets/server-select';

export interface User {
  login: string;
  pwd: string;
}

const minLength = 5; //for login & pwd
const maxLength = 15; //for login & pwd

const storageKey = 'user';

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
    this.user = { login: '', pwd: '' };
    this.loginBtn = html.button({
      text: 'Login',
      disabled: true,
      callback: () => {
        if (this.user.login && this.user.pwd) {
          const login: string = this.user.login;
          const pwd: string = this.user.pwd;

          this.socketLogin(login, pwd);
        }
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

  public getUserInfo(): User {
    return this.user;
  }

  public getView(): HTMLElement {
    this.getSessionStorageLogin();

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
    }
  }

  public logOut(): void {
    try {
      sessionStorage.removeItem(storageKey);
      this.user = { login: '', pwd: '' };
      this.clearLoginInput();

      globalThis.location.href = '#/';
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  private clearLoginInput(): void {
    this.nameInput.value = '';
    this.pwdInput.value = '';
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
        this.user.login = inputValue(event, minLength, maxLength, 'login') || '';
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
        this.user.pwd = inputValue(event, minLength, maxLength, 'pwd') || '';
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
  private setSessionStorageLogin(): void {
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ login: this.user.login, pwd: this.user.pwd })
      );
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  private getSessionStorageLogin(): void {
    try {
      const storedData: string | undefined = sessionStorage.getItem(storageKey) || undefined;
      if (storedData) {
        const parsedData: unknown = JSON.parse(storedData);
        if (
          parsedData &&
          typeof parsedData === 'object' &&
          'login' in parsedData &&
          typeof parsedData.login === 'string' &&
          'pwd' in parsedData &&
          typeof parsedData.pwd === 'string'
        ) {
          this.user.login = parsedData.login;
          this.user.pwd = parsedData.pwd;

          this.socketLogin(this.user.login, this.user.pwd);
        }
      }
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }
  private socketLogin(login: string, pwd: string): void {
    wSocket.login(login, pwd).then((response: LoginResult) => {
      if (response) {
        if (response.result) {
          globalThis.location.href = '#/chat';
          this.setSessionStorageLogin();
        } else {
          messageWrongPassword(response.message);
        }
      }
    });
  }
}

export const login = new Login();

//---------------------------------------

const inputValue = (data: Event, min = 5, max = 15, type: 'login' | 'pwd'): string | undefined => {
  const result: string = data.target instanceof HTMLInputElement ? data.target.value : '';
  const value: string = result.trim();

  if (value.length >= min && value.length <= max) {
    if (type === 'login' && /^[a-zA-Zа-яА-ЯёЁ0-9]+$/.test(value)) {
      return value;
    }
    if (type === 'pwd' && /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+$/.test(value)) {
      return value;
    }
  }

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
