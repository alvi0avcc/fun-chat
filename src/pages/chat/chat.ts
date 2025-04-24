import './chat.css';
import logo from '../../assets/chat-icon.png';

import * as html from '../../builder/elements';
import { footer } from '../chat/footer';

import { dividerInit } from '../../divider/divider';

import { wSocket } from '../../websockets/websocket';
import { chatMessages } from './chat-messages';
import type { Message } from './chat-messages';
import type { User } from '../../websockets/websocket';
import { login } from '../login/login';

export class Chat {
  private main: HTMLElement;
  private userSection: HTMLElement;
  private chatSection: HTMLElement;
  private divider: HTMLElement;
  private userName = '';
  private titleUserName: HTMLLabelElement;
  private userForMessage = '';
  private activeUsers: User[] = [];
  private inActiveUsers: User[] = [];
  private allUsers: User[] = [];
  private usersList: HTMLSelectElement;
  private chatMessage: HTMLElement;

  constructor() {
    this.usersList = html.select({ id: 'users-list', styles: ['select', 'users-list'] });
    this.usersList.addEventListener('click', (event: Event) => {
      if (
        event.target &&
        'value' in event.target &&
        event.target.value &&
        typeof event.target.value === 'string'
      ) {
        this.userForMessage = event.target.value;
        this.chatMessageReadWrite();
      }
    });
    this.titleUserName = html.label({
      text: `User: ${this.userName || 'Incognito'}`,
      styles: ['label', 'title-username'],
    });
    this.userSection = this.userSectionCreate();
    this.chatMessage = this.chatMessageCreate();
    this.chatSection = this.chatSectionCreate();
    this.divider = this.dividerCreate();
    this.main = this.mainSectionCreate();
  }

  public get getUserName(): string {
    return this.userName || '';
  }

  public set setActiveUsers(users: User[]) {
    this.activeUsers = users.filter((user) => user.login !== this.userName);
    this.updateUserList();
  }

  public set setInActiveUsers(users: User[]) {
    this.inActiveUsers = users.filter((user) => user.login !== this.userName);
    this.updateUserList();
  }

  public set setUserName(userName: string) {
    this.userName = userName;
  }

  public addActiveUser(newUser: User): void {
    if (!this.activeUsers.some((user) => user.login === newUser.login)) {
      this.activeUsers.push(newUser);
    }
    const index: number = this.inActiveUsers.findIndex((user) => user.login === newUser.login);
    if (index !== -1) this.inActiveUsers.splice(index, 1);
    this.updateUserList();
  }

  public removeInActiveUser(oldUser: User): void {
    const index: number = this.activeUsers.findIndex((user) => user.login === oldUser.login);
    if (index !== -1) this.activeUsers.splice(index, 1);

    if (!this.inActiveUsers.some((user) => user.login === oldUser.login)) {
      this.inActiveUsers.push(oldUser);
    }
    this.updateUserList();
  }

  public getView(): HTMLElement {
    this.titleUserName.textContent = `User: ${this.userName || 'Incognito'}`;
    wSocket.getActiveUsers();
    wSocket.getInActiveUsers();
    return this.main ?? document.createElement('div');
  }

  public async init(): Promise<void> {
    dividerInit(this.divider, this.userSection, this.chatSection);
  }

  public userListCreate(users: User[]): void {
    const options: HTMLOptionElement[] = users.map((user) =>
      html.option({
        text: user.login,
        value: user.login,
        styles: ['option', `option-${user.isLogined ? 'active' : 'inactive'}`],
      })
    );
    this.usersList.size = options.length + 1;
    this.usersList.replaceChildren();
    this.usersList.append(...options);
  }

  public chatMessageUpdate(): void {
    if (this.userName) {
      const userMessages: Message[] | undefined = chatMessages.getUserMessage(this.userForMessage);

      if (userMessages) {
        this.chatMessage.replaceChildren();
        for (const message of userMessages) {
          this.chatMessage.append(html.section({ text: message.message }));
        }
      }
    }
  }

  private updateUserList(): void {
    this.allUsers = [...this.activeUsers, ...this.inActiveUsers];
    this.userListCreate(this.allUsers);
  }

  private dividerCreate(): HTMLElement {
    return (this.divider = html.section({ id: 'divider', styles: ['divider'] }));
  }

  private userSectionCreate(): HTMLElement {
    if (!this.usersList) this.usersList = html.select({ id: 'users-list' });
    return (this.userSection = html.section({
      id: 'user-section',
      styles: ['section', 'user-section'],
      children: [html.input({ type: 'text', placeholder: 'Search...' }), this.usersList],
    }));
  }

  private chatSectionCreate(): HTMLElement {
    let message = '';
    return (this.chatSection = html.section({
      id: 'chat-section',
      styles: ['section', 'chat-section'],
      children: [
        html.section({}),
        this.chatMessage,
        html.section({
          styles: ['write-section'],
          children: [
            html.textArea({
              placeholder: 'write message...',
              callback: (event) => {
                if (
                  event.target &&
                  'value' in event.target &&
                  typeof event.target.value === 'string'
                ) {
                  message = event.target.value;
                }
              },
            }),
            html.button({
              text: 'Send',
              callback: () => {
                wSocket.sendMessage(this.userForMessage, message);
              },
            }),
          ],
        }),
      ],
    }));
  }

  private chatMessageCreate(): HTMLElement {
    return (this.chatMessage = html.section({
      id: 'chat-messages',
      styles: ['section', 'chat-messages'],
    }));
  }

  private chatMessageReadWrite(): void {
    if (this.userName && chatMessages) {
      const messages: Message[] | undefined = chatMessages.getUserMessage(this.userName);
      this.chatMessage.replaceChildren();
      if (messages) {
        for (const element of messages) {
          this.chatMessage.append(html.section({ text: element.message }));
        }
      } else {
        this.chatMessage.append(html.section({ text: 'Start messaging' }));
      }
    }
  }

  private mainSectionCreate(): HTMLElement {
    return (this.main = html.section({
      id: 'main',
      tag: 'main',
      styles: ['main', 'chat'],
      children: [this.tittle(), this.chat(), footer()],
    }));
  }

  private tittle(): HTMLElement {
    return html.section({
      id: 'title',
      styles: ['section', 'chat-title'],
      children: [
        html.section({
          tag: 'div',
          children: [this.titleUserName],
        }),
        html.section({
          tag: 'div',
          styles: ['chat-logo'],
          children: [html.label({ text: 'Fun Chat' }), html.img({ source: logo })],
        }),
        html.section({
          tag: 'div',
          styles: ['chat-title-buttons'],
          children: [
            html.a({
              text: 'About',
              styles: ['button'],
              attributes: { 'data-router-link': '' },
              href: '/about',
            }),
            html.button({
              text: 'Exit',
              callback: () => wSocket.logOut(login.getUserInfo()),
            }),
          ],
        }),
      ],
    });
  }

  private chat(): HTMLElement {
    return html.section({
      id: 'chat',
      styles: ['section', 'chat'],
      children: [this.userSection, this.divider, this.chatSection],
    });
  }
}

export const chat = new Chat();
