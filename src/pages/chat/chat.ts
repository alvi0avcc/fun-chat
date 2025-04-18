import './chat.css';
import logo from '../../assets/chat-icon.png';

import * as html from '../../builder/elements';
import { footer } from '../chat/footer';

import { dividerInit } from '../../divider/divider';

export class Chat {
  private main: HTMLElement | undefined;
  private userSection: HTMLElement = html.createElement();
  private chatSection: HTMLElement = html.createElement();
  private divider: HTMLElement = html.createElement();
  private userName: string | undefined;

  constructor() {
    this.main = undefined;
  }

  public getView(): HTMLElement {
    return this.main ?? document.createElement('div');
  }

  public async init(): Promise<void> {
    this.userSectionCreate();
    this.dividerCreate();
    this.chatSectionCreate();

    if (!this.main) {
      this.main = html.section({
        id: 'main',
        tag: 'main',
        styles: ['main', 'chat'],
        children: [this.tittle(), this.chat(), footer()],
      });

      dividerInit(this.divider, this.userSection, this.chatSection);
    }
  }

  private dividerCreate(): void {
    this.divider = html.section({ id: 'divider', styles: ['divider'] });
  }

  private userSectionCreate(): void {
    this.userSection = html.section({
      id: 'user-section',
      styles: ['section', 'user-section'],
      children: [
        html.input({ type: 'text', placeholder: 'Search...' }),
        html.section({
          id: 'user-list-section',
          children: [html.ul({ id: 'user-list' })],
        }),
      ],
    });
  }

  private chatSectionCreate(): void {
    this.chatSection = html.section({
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
    });
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
