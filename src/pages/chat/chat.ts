import './chat.css';
import logo from '../../assets/chat-icon.png';

import * as html from '../../builder/elements';
import { footer } from '../chat/footer';

import { dividerInit } from '../../divider/divider';

import { wSocket } from '../../websockets/websocket';
import type { User } from '../../websockets/websocket';

export class Chat {
  private main: HTMLElement;
  private userSection: HTMLElement;
  private chatSection: HTMLElement;
  private divider: HTMLElement;
  private userName: string | undefined;
  private usersList: HTMLSelectElement;

  constructor() {
    this.usersList = html.select({ id: 'users-list', styles: ['select', 'users-list'] });
    this.userSection = this.userSectionCreate();
    this.chatSection = this.chatSectionCreate();
    this.divider = this.dividerCreate();
    this.main = this.mainSectionCreate();
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
    this.usersList.size = options.length;
    this.usersList.replaceChildren();
    this.usersList.append(...options);
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
    return (this.chatSection = html.section({
      id: 'chat-section',
      styles: ['section', 'chat-section'],
      children: [
        html.section({}),
        html.section({
          id: 'message-section',
          children: [],
        }),
        html.section({}),
      ],
    }));
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
