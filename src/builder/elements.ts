export const section = ({
  id = undefined,
  tag = 'section',
  text = '',
  children = undefined,
  callback = undefined,
  styles = [tag],
  attributes = {},
}: {
  id?: string;
  tag: string;
  text?: string;
  children?: HTMLElement[];
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLElement => {
  const element: HTMLElement = document.createElement(tag);
  if (id) element.id = id;
  if (text) element.textContent = text;
  if (styles) element.classList.add(...styles);
  if (children) element.append(...children);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const h = ({
  id = '',
  tag = 'h1',
  text = '',
  align = 'center',
  callback = undefined,
  styles = [tag],
  attributes = {},
}: {
  id?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: string;
  align?: string;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLHeadingElement => {
  const element: HTMLHeadingElement = document.createElement(tag);
  if (id) element.id = id;
  if (text) element.textContent = text;
  if (align) element.style.textAlign = align;
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const a = ({
  id = '',
  text = '',
  href = '',
  target = '_self',
  callback = undefined,
  styles = ['a'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLAnchorElement => {
  const element: HTMLAnchorElement = document.createElement('a');
  if (id) element.id = id;
  if (text) element.textContent = text;
  if (href) element.href = href;
  if (target) element.target = target;
  if (target === '_blank') {
    element.rel = 'noopener noreferrer';
  }
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const button = ({
  id = '',
  text = '',
  type = 'button',
  disabled = false,
  callback,
  styles = ['button'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  type?: 'reset' | 'submit' | 'button';
  disabled?: boolean;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLButtonElement => {
  const element = Object.assign(document.createElement('button'), {
    id,
    textContent: text,
    type,
    disabled,
  });
  element.classList.add(...styles);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (callback) element.addEventListener('click', callback);
  return element;
};

export const input = ({
  id = '',
  placeholder = '',
  type = 'text',
  value = '',
  list = '',
  disabled = false,
  title,
  callback,
  eventType = 'change',
  styles = ['input'],
  attributes = {},
}: {
  id?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'color' | 'password';
  list?: string;
  value?: string;
  disabled?: boolean;
  title?: string;
  callback?: EventListener;
  eventType?: 'change' | 'keypress' | 'input';
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLInputElement => {
  const element = Object.assign(document.createElement('input'), {
    id,
    placeholder,
    type,
    value,
    disabled,
    title,
  });

  if (list) element.setAttribute('list', list);
  if (styles.length > 0) element.classList.add(...styles);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (callback) element.addEventListener(eventType, callback);

  return element;
};

export const datalist = ({
  id = '',
  children,
  styles = ['datalist'],
  attributes = {},
}: {
  id?: string;
  children?: HTMLElement[];
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLDataListElement => {
  const element = Object.assign(document.createElement('datalist'), { id });
  if (children) element.append(...children);
  element.classList.add(...styles);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
};

export const inputFileLoad = (id = '', callback?: (event: Event) => void): HTMLInputElement => {
  const input: HTMLInputElement = document.createElement('input');
  input.id = id;
  input.type = 'file';
  input.accept = '.json';
  input.hidden = true;
  input.value = '';
  if (callback) input.addEventListener('input', (event: Event) => callback(event));
  return input;
};

export const label = ({
  id = '',
  text = 'label',
  htmlFor = undefined,
  callback = undefined,
  styles = ['label'],
}: {
  id?: string;
  text?: string;
  htmlFor?: string;
  callback?: EventListener;
  styles?: string[];
}): HTMLLabelElement => {
  const label: HTMLLabelElement = document.createElement('label');
  if (id) label.id = id;
  if (text) label.textContent = text;
  if (htmlFor) label.htmlFor = htmlFor;
  if (styles) label.classList.add(...styles);
  if (callback) label.addEventListener('click', (event) => callback(event));
  return label;
};

export const select = ({
  id = '',
  disabled = false,
  callback = undefined,
  styles = ['select'],
  attributes = {},
}: {
  id?: string;
  disabled?: boolean;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLSelectElement => {
  const element: HTMLSelectElement = document.createElement('select');
  if (id) element.id = id;
  if (disabled) element.disabled = disabled;
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('change', (event) => callback(event));
  return element;
};

export const options = ({
  id = '',
  value = '',
  disabled = false,
  callback = undefined,
  styles = ['option'],
  attributes = {},
}: {
  id?: string;
  value: string;
  disabled?: boolean;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLOptionElement => {
  const element: HTMLOptionElement = document.createElement('option');
  if (id) element.id = id;
  if (value) element.value = value;
  if (disabled) element.disabled = disabled;
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const img = ({
  id = '',
  source = '',
  callback = undefined,
  styles = ['img'],
}: {
  id?: string;
  source?: string;
  callback?: EventListener;
  styles?: string[];
}): HTMLImageElement => {
  const element: HTMLImageElement = document.createElement('img');
  if (id) element.id = id;
  if (source) element.src = source;
  if (styles) element.classList.add(...styles);
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const svg = ({
  id = '',
  viewBox = '',
  width = '',
  height = '',
  callback = undefined,
  styles = ['svg'],
  children = [],
  attributes = undefined,
}: {
  id?: string;
  width?: string;
  height?: string;
  viewBox?: string;
  callback?: EventListener;
  styles?: string[];
  children?: SVGElement[];
  attributes?: Record<string, string>;
}): HTMLElement => {
  const element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  if (id) element.id = id;
  if (viewBox) element.setAttribute('viewBox', viewBox);
  if (width) element.setAttribute('width', width);
  if (height) element.setAttribute('height', height);
  for (const child of children) {
    if (child instanceof SVGElement) {
      element.append(child);
    }
  }
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  const container: HTMLElement = document.createElement('div');
  container.append(element);

  return container;
};

export const svgImage = ({
  id = '',
  href = '',
  viewBox = '',
  width = '',
  height = '',
  callback = undefined,
  styles = ['svg-image'],
  children = [],
  attributes = undefined,
}: {
  id?: string;
  href?: string;
  width?: string;
  height?: string;
  viewBox?: string;
  callback?: EventListener;
  styles?: string[];
  children?: SVGElement[];
  attributes?: Record<string, string>;
}): SVGImageElement => {
  const element: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');

  if (id) element.id = id;
  if (href) element.setAttribute('href', href);
  if (viewBox) element.setAttribute('viewBox', viewBox);
  if (width) element.setAttribute('width', width);
  if (height) element.setAttribute('height', height);
  for (const child of children) {
    if (child instanceof SVGElement) {
      element.append(child);
    }
  }
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));

  return element;
};

export const use = ({
  id = '',
  href = '',
  width = '',
  height = '',
  callback = undefined,
  styles = ['use'],
  attributes = undefined,
}: {
  id?: string;
  href?: string;
  width?: string;
  height?: string;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): SVGUseElement => {
  const element: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  if (id) element.id = id;
  if (href) element.setAttribute('href', href);
  if (width) element.setAttribute('width', width);
  if (height) element.setAttribute('height', height);
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const ul = (
  tag = 'ul',
  id = '',
  text = '',
  callback: EventListener | undefined = undefined
): HTMLElement => {
  const ul: HTMLElement = document.createElement('ul');
  ul.id = id;
  ul.textContent = text;
  ul.classList.add(tag);
  if (callback) ul.addEventListener('click', (event) => callback(event));
  return ul;
};

export const li = (
  tag = 'li',
  id = '',
  text = '',
  callback: EventListener | undefined = undefined
): HTMLElement => {
  const li: HTMLElement = document.createElement('li');
  li.id = id;
  li.textContent = text;
  li.classList.add(tag);
  if (callback) li.addEventListener('click', (event) => callback(event));
  return li;
};

export const dialog = ({
  id = undefined,
  text = '',
  children = undefined,
  callback = undefined,
  styles = ['dialog'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  children?: HTMLElement[];
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLDialogElement => {
  const element: HTMLDialogElement = document.createElement('dialog');
  if (id) element.id = id;
  if (text) element.textContent = text;
  if (styles) element.classList.add(...styles);
  if (children) element.append(...children);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const form = (id = 'form'): HTMLFormElement => {
  const form = document.createElement('form');
  form.id = id;
  form.textContent = '';

  return form;
};

export const textArea = (id = 'text-area'): HTMLTextAreaElement => {
  const text = document.createElement('textarea');
  text.id = id;
  text.textContent = '';

  return text;
};

export const createElement = (tag = 'div'): HTMLElement => {
  return document.createElement(tag);
};
