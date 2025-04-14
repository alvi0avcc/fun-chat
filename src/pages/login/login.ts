import './login.css';

import * as create from '../../builder/elements';

interface User {
  login: string | undefined;
  pwd: string | undefined;
}

export class Login {
  private main: HTMLElement | undefined;
  private user: User;

  constructor() {
    this.main = undefined;
    this.user = { login: undefined, pwd: undefined };
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
    }
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
            create.input({
              id: 'login',
              type: 'text',
              placeholder: 'User Name',
              callback: (event) => {
                console.log(event);
                this.user.login = 'test';
              },
            }),
            create.label({ text: 'Password', htmlFor: 'passwd' }),
            create.input({ id: 'passwd', type: 'password', placeholder: 'Password' }),
          ],
        }),
        create.section({
          tag: 'div',
          styles: ['form-btn'],
          children: [create.button({ text: 'Login' }), create.button({ text: 'About' })],
        }),
      ],
    });
  }
}

export const login = new Login();
