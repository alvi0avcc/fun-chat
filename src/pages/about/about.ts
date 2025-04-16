import './about.css';

import image from '../../assets/chat-icon.png';

import * as html from '../../builder/elements';

export class About {
  private main: HTMLElement | undefined;

  constructor() {
    this.main = undefined;
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
        children: [
          html.section({
            tag: 'article-about',
            children: [
              html.section({
                styles: ['section', 'title'],
                children: [html.label({ text: 'Fun Chat' }), html.img({ source: image })],
              }),
              html.p({
                text: 'The application "Fun Chat" was developed according to an educational assignment.',
                align: 'center',
              }),
              html.a({
                text: 'Task «Fun Chat»',
                href: 'https://github.com/rolling-scopes-school/tasks/blob/master/stage2/tasks/fun-chat/README.md',
                target: '_blank',
              }),
              html.p({ text: 'Your advertisement could be here.', align: 'center' }),
              html.a({
                text: 'Go to Chat',
                href: '#/chat',
                attributes: { 'data-router-link': '' },
                styles: ['button'],
              }),
            ],
          }),
        ],
      });
    }
  }
}

export const about = new About();
