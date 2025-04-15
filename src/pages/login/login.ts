import './login.css';

import * as create from '../../builder/elements';
import { wSocket } from '../../websockets/websocket';

interface User {
  login: string | undefined;
  pwd: string | undefined;
}

const minLength = 4;
const maxLength = 15;

export class Login {
  private main: HTMLElement | undefined;
  private user: User;
  private loginBtn: HTMLButtonElement;
  private aboutBtn: HTMLAnchorElement;
  private nameInput: HTMLInputElement = document.createElement('input');
  private pwdInput: HTMLInputElement = document.createElement('input');

  constructor() {
    this.main = undefined;
    this.user = { login: undefined, pwd: undefined };
    this.loginBtn = create.button({
      text: 'Login',
      disabled: true,
      callback: () => {
        if (this.user.login && this.user.pwd)
          wSocket.login(this.user.login, this.user.pwd).then((response) => {
            console.log(response);
            if (response?.result) {
              globalThis.location.href = '#/chat';
            }
          });
      },
    });
    this.aboutBtn = create.a({
      text: 'About',
      href: '/about',
      attributes: { 'data-router-link': '' },
      styles: ['button'],
    });
    this.initBtnNamePwd();
  }

  public getView(): HTMLElement {
    return this.main ?? document.createElement('div');
  }

  public async init(): Promise<void> {
    if (!this.main) {
      this.main = create.section({
        id: 'main',
        tag: 'main',
        styles: ['main'],
        children: [this.loginForm()],
      });
      wSocket.create();
    }
  }

  private initBtnNamePwd(): void {
    this.nameInput = create.input({
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

    this.pwdInput = create.input({
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
    return create.section({
      id: 'login-form',
      tag: 'form',
      children: [
        create.section({
          tag: 'fieldset',
          children: [
            create.section({ tag: 'legend', text: 'Authorization' }),
            create.label({ text: 'Login', htmlFor: 'login' }),
            this.nameInput,
            create.label({ text: 'Password', htmlFor: 'passwd' }),
            this.pwdInput,
          ],
        }),
        create.section({
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

function inputValue(data: Event, min = 4, max = 15): string | undefined {
  const result: string = data.target instanceof HTMLInputElement ? data.target.value : '';
  if (result.length >= min && result.length <= max) return result;
  return undefined;
}
