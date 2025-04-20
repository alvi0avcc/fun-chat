/* eslint unicorn/no-null: "off" */

import './websocket.css';
import * as html from '../builder/elements';

import loadingImg from '../assets/loading.gif';
import { dlgServerSelect } from './server-select';
import gear from '../assets/gear.svg';

import { login } from '../pages/login/login';
import { chat } from '../pages/chat/chat';

const SERVER_NULL = null;
interface UserLogin {
  id: string;
  type: 'USER_LOGIN';
  payload: {
    user: {
      login: string;
      password?: string;
      isLogined?: boolean;
    };
  };
}

interface UserLogined {
  id: string;
  type: 'ERROR';
  payload: {
    error: string;
  };
}

interface LoginResult {
  result: boolean;
  message: string;
}

export interface User {
  login: string;
  isLogined: boolean;
}

interface requestActiveUsers {
  id: string;
  type: 'USER_ACTIVE';
  payload: typeof SERVER_NULL;
}

interface responseActiveUsers {
  id: string;
  type: 'USER_ACTIVE';
  payload: {
    users: User[];
  };
}

class WebS {
  private socket: WebSocket | undefined;
  private pendingRequests = new Set<string>();
  private url: string;
  private logined: boolean;
  private loadingDlg: HTMLDialogElement | undefined;

  constructor() {
    this.url = 'ws://127.0.0.1:4000';
    this.logined = false;
  }

  public get getUrl(): string {
    return this.url;
  }

  public get isLogined(): boolean {
    return this.logined;
  }

  public get isReady(): boolean {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return true;
    return false;
  }

  public set setUrl(url: string) {
    if (!url) return;
    this.url = url;
    this.socket?.close();
    this.create();
    console.log(this.socket);
  }

  public create(): void {
    if (!this.socket || this.socket?.CLOSED) {
      this.socket = new WebSocket(this.url);

      this.socket.addEventListener('open', (event) => {
        console.log('open =', event);
        this.onOpen();
      });

      this.socket.addEventListener('close', (event) => {
        console.log('close =', event);
        this.onClose();
      });

      this.socket.addEventListener('error', (event) => {
        console.log('error =', event);
      });

      this.socket.addEventListener('message', (event) => {
        this.onMessage(event);
      });
    }
  }

  public close(code = 1000, reason = 'Connection closed'): void {
    if (!this.socket || this.socket?.CLOSED) this.socket?.close(code, reason);
  }

  public async login(userName: string, password: string): Promise<LoginResult | undefined> {
    if (!this.isReady) return { result: false, message: 'Not connected' };

    const request = createLoginRequest(userName, password);
    const response = await this.sendLoginRequest(request);
    // console.log('test=', response);

    if (isUserLoginResponse(response) && response.payload.user.isLogined)
      return { result: true, message: 'Login successful' };
    // console.log('auth =', isUserLoginedResponse(response));

    if (isUserLoginedResponse(response)) return { result: false, message: response.payload.error };
    if (!isUserLoginResponse(response))
      return { result: false, message: response.message || 'Invalid credentials' };
  }

  public getActiveUsers(): void {
    if (!this.isReady || !this.socket) {
      return;
    }

    const requestId = `req_${Date.now()}_${getSafeUUID()}`;

    const request: requestActiveUsers = {
      id: requestId,
      type: 'USER_ACTIVE',
      payload: SERVER_NULL,
    };

    this.pendingRequests.add(requestId);

    this.socket.send(JSON.stringify(request));
  }

  private sendLoginRequest(request: UserLogin): Promise<UserLogin | LoginResult | UserLogined> {
    return new Promise((resolve, reject) => {
      const cleanup = (): void => this.socket?.removeEventListener('message', handler);

      const handler = (event: MessageEvent): void => {
        try {
          const response: unknown = JSON.parse(event.data);
          // console.log('test2 =', response);
          // console.log('auth2 =', isUserLoginedResponse(response));

          if (isUserLoginResponse(response) && response.id === request.id) {
            cleanup();
            resolve(response);
          }

          if (isUserLoginedResponse(response) && response.id === request.id) {
            cleanup();
            resolve(response);
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      this.setupRequest(handler, request, reject);
    });
  }

  private setupRequest(
    handler: (event: MessageEvent) => void,
    request: UserLogin,
    reject: (reason?: unknown) => void
  ): void {
    this.socket?.addEventListener('message', handler);

    try {
      this.socket?.send(JSON.stringify(request));
    } catch (error) {
      this.socket?.removeEventListener('message', handler);
      reject(error);
    }
  }

  private onOpen(): void {
    if (this.loadingDlg) {
      this.loadingDlg.close();
      this.loadingDlg.remove();
      this.loadingDlg = undefined;
    }
    login.setCurrentServerLabel();
  }

  private onClose(): void {
    if (!this.loadingDlg) {
      this.loadingDlg = html.dialog({
        id: 'try-connect-dialog',
        styles: ['dialog', 'dialog-reconnect'],
        children: [
          html.img({ source: loadingImg }),
          html.h({ tag: 'h2', text: 'connecting' }),
          html.button({
            styles: ['settings'],
            children: [html.img({ source: gear })],
            attributes: { title: 'Click for select server' },
            callback: () => {
              dlgServerSelect();
            },
          }),
        ],
      });

      document.body.append(this.loadingDlg);
      this.loadingDlg.showModal();
    }

    setTimeout(() => {
      this.create();
    }, 3000);
  }

  private onMessage(event: MessageEvent): void {
    console.log('message =', event);

    try {
      const response: unknown = JSON.parse(event.data);
      console.log('response =', response);

      if (isUserLoginResponse(response)) {
        const { payload } = response;
        console.log(response);
        console.log('Logined:', response.payload.user.isLogined);
        this.logined = payload.user.isLogined ?? false;
        console.log(this.logined);
      }

      console.log('isActiveUserResponse =', isActiveUserResponse(response));

      if (isActiveUserResponse(response)) {
        const { id, payload } = response;
        console.log(response);
        console.log(id);
        console.log(payload.users);
        console.log(this.pendingRequests);
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          console.log(`remove "${id}" from pendingRequests`);
          chat.userListCreate(payload.users);
        }
      }
    } catch (error) {
      console.error('Unknown error:', error);
    }
  }
}

export const wSocket = new WebS();

//---------------------------------------

function isUserLoginResponse(data: unknown): data is UserLogin {
  if (typeof data !== 'object' || data === null) return false;
  if (!('id' in data) || !('type' in data) || !('payload' in data)) return false;
  if (typeof data.id !== 'string' || data.type !== 'USER_LOGIN') return false;
  if (typeof data.payload !== 'object' || data.payload === null) return false;
  if (!('user' in data.payload)) return false;
  if (typeof data.payload.user !== 'object' || data.payload.user === null) return false;
  if (!('login' in data.payload.user) || !('isLogined' in data.payload.user)) return false;
  return (
    typeof data.payload.user.login === 'string' && typeof data.payload.user.isLogined === 'boolean'
  );
}

function isUserLoginedResponse(data: unknown): data is UserLogined {
  if (typeof data !== 'object' || data === null) return false;
  if (!('id' in data) || !('type' in data) || !('payload' in data)) return false;
  if (typeof data.id !== 'string' || data.type !== 'ERROR') return false;
  if (typeof data.payload !== 'object' || data.payload === null) return false;
  if (!('error' in data.payload)) return false;
  return typeof data.payload.error === 'string';
}

function createLoginRequest(userName: string, password: string): UserLogin {
  return {
    id: `login-${Date.now()}`,
    type: 'USER_LOGIN',
    payload: { user: { login: userName, password } },
  };
}

function isActiveUserResponse(data: unknown): data is responseActiveUsers {
  if (typeof data !== 'object' || data === null) return false;
  if (!('id' in data) || !('type' in data) || !('payload' in data)) return false;
  if (typeof data.id !== 'string' || data.type !== 'USER_ACTIVE') return false;
  if (typeof data.payload !== 'object' || data.payload === null) return false;
  if (!('id' in data) || !('type' in data) || !('payload' in data)) return false;
  if (!('users' in data.payload) || !Array.isArray(data.payload.users)) return false;

  return true;
}

function getSafeUUID(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (c) => {
      const r = Math.trunc(Math.random() * 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}
