import './chat.css';
import logo from '../../assets/chat-icon.png';

import * as html from '../../builder/elements';
import { footer } from '../chat/footer';

import { dividerInit } from '../../divider/divider';

import { wSocket } from '../../websockets/websocket';
import { chatMessages } from './chat-messages';
import type { Message } from './chat-messages';
import type { User } from '../../websockets/websocket';

export class Chat {
  private main: HTMLElement;
  private userSection: HTMLElement;
  private chatSection: HTMLElement;
  private divider: HTMLElement;
  private userName = '';
  private userForMessage = '';
  private usersList: HTMLSelectElement;
  private chatMessage: HTMLElement;

  constructor() {
    this.usersList = html.select({ id: 'users-list', styles: ['select', 'users-list'] });
    this.usersList.addEventListener('click', (event: Event) => {
      console.log(event);
      if (event.target && 'value' in event.target) {
        console.log('value =', event.target.value);
        if (event.target.value && typeof event.target.value === 'string') {
          this.userForMessage = event.target.value;
          this.chatMessageReadWrite();
        }
      }
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

  public set setUserName(userName: string) {
    this.userName = userName;
  }

  public getView(): HTMLElement {
    wSocket.getActiveUsers();
    return this.main ?? document.createElement('div');
  }

  public async init(): Promise<void> {
    dividerInit(this.divider, this.userSection, this.chatSection);
  }

  public userListCreate(users: User[]): void {
    const options: HTMLOptionElement[] = users.map((user) => new Option(user.login, user.login));
    this.usersList.size = options.length + 1;
    this.usersList.replaceChildren();
    this.usersList.append(...options);
  }

  public chatMessageUpdate(): void {
    console.log('chatMessageUpdate');
    console.log('this.userName =', this.userName);
    console.log('this.userForMessage =', this.userForMessage);

    if (this.userName) {
      const userMessages: Message[] | undefined = chatMessages.getUserMessage(this.userForMessage);
      console.log('userMessages =', userMessages);

      if (userMessages) {
        console.log('chatMessageUpdate =', userMessages);
        this.chatMessage.replaceChildren();
        for (const message of userMessages) {
          this.chatMessage.append(html.section({ text: message.message }));
        }
      }
    }
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
                console.log('write message... =', event);

                if (
                  event.target &&
                  'value' in event.target &&
                  typeof event.target.value === 'string'
                ) {
                  console.log('write message... =', event.target.value);
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
    console.log('chatMessageReadWrite');

    if (this.userName && chatMessages) {
      const messages: Message[] | undefined = chatMessages.getUserMessage(this.userName);
      this.chatMessage.replaceChildren();
      if (messages) {
        console.log('messages');

        for (const element of messages) {
          this.chatMessage.append(html.section({ text: element.message }));
        }
      } else {
        console.log('start start messaging');

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
          children: [
            html.p({
              text: `User: ${this.userName || 'Incognito'}`,
              styles: ['p', 'title-user-name'],
            }),
          ],
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
