import { wSocket } from '../websockets/websocket';
import * as html from '../builder/elements';

export const dlgServerSelect = (): void => {
  const dlg: HTMLDialogElement = html.dialog({
    id: 'dialog-server-select',
    styles: ['dialog', 'dialog-server-select'],
    children: [html.h({ tag: 'h3', text: 'Select Server:' })],
  });

  const select: HTMLSelectElement = selectCreate();
  dlg.append(select, buttonCreate(dlg, select));

  dlg.addEventListener('close', () => dlg.remove());

  document.body.append(dlg);
  dlg.showModal();
};

const selectCreate = (): HTMLSelectElement => {
  const select: HTMLSelectElement = html.select({
    id: 'server-select',
    children: [
      html.option({
        text: 'Server 1 - MikAleinik',
        value: 'wss://mik-aleinik.by/chat',
        attributes: { title: 'wss://mik-aleinik.by/chat' },
      }),
      html.option({
        text: 'Server 2 - Local',
        value: 'ws://127.0.0.1:4000',
        attributes: { title: 'ws://127.0.0.1:4000' },
      }),
    ],
  });

  select.value = wSocket.getUrl;

  return select;
};

const buttonCreate = (dlg: HTMLDialogElement, select: HTMLSelectElement): HTMLElement => {
  return html.section({
    tag: 'div',
    children: [
      html.button({
        text: 'Cancel',
        callback: () => {
          dlg.close();
        },
      }),
      html.button({
        text: 'OK',
        callback: () => {
          dlg.close();
          wSocket.setUrl = select.value;
        },
      }),
    ],
  });
};
