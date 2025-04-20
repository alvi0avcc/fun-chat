import './app.css';

import type { Route } from '../router/router';
import { Router } from '../router/router';

// import { header } from '../pages/header-nav/header-nav';
import { login } from '../pages/login/login';
import { chat } from '../pages/chat/chat';
import { about } from '../pages/about/about';
import { notFoundView } from '../pages/404/404';

import { wSocket } from '../websockets/websocket';

const notFoundPage: Route = {
  path: '/404',
  view: (root: HTMLElement): void => {
    // if (header) root.append(header);
    root.append(notFoundView());
  },
};

const routes: Route[] = [
  {
    path: '/',
    view: async (root: HTMLElement): Promise<void> => {
      // if (header) root.append(header);
      if (wSocket.isLogined) {
        globalThis.location.href = '#/chat';
        await chat.init();
        root.append(chat.getView());
      } else {
        await login.init();
        root.append(login.getView());
      }
    },
  },
  {
    path: '/chat',
    view: async (root: HTMLElement): Promise<void> => {
      // if (header) root.append(header);
      await chat.init();
      root.append(chat.getView());
    },
  },
  {
    path: '/about',
    view: async (root: HTMLElement): Promise<void> => {
      // if (header) root.append(header);
      await about.init();
      root.append(about.getView());
    },
  },
  notFoundPage,
];

export default class App {
  private root: HTMLElement;
  private router: Router | undefined;

  constructor() {
    this.root = document.body;
  }

  public init(): void {
    this.router = new Router(this.root, routes, notFoundPage);
    wSocket.create();
  }
}
