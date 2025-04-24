import './app.css';

import type { Route } from '../router/router';
import { Router } from '../router/router';

import { login } from '../pages/login/login';
import { chat } from '../pages/chat/chat';
import { about } from '../pages/about/about';
import { notFoundView } from '../pages/404/404';

import { wSocket } from '../websockets/websocket';

const notFoundPage: Route = {
  path: '/404',
  view: (root: HTMLElement): void => {
    root.append(notFoundView());
  },
};

const routes: Route[] = [
  {
    path: '/',
    view: async (root: HTMLElement): Promise<void> => {
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
      if (wSocket.isLogined) {
        await chat.init();
        root.append(chat.getView());
      } else {
        globalThis.location.href = '#/';
      }
    },
  },
  {
    path: '/about',
    view: async (root: HTMLElement): Promise<void> => {
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
