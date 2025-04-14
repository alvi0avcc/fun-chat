import './chat.css';

import * as create from '../../builder/elements';

export class Chat {
  private main: HTMLElement | undefined;

  constructor() {
    this.main = undefined;
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
        children: [],
      });
    }
  }
}

export const chat = new Chat();
