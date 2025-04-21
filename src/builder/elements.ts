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
  tag?: string;
  text?: string;
  children?: HTMLElement[];
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLElement => {
  const element: HTMLElement = document.createElement(tag);
  element.textContent = text;

  if (id) element.id = id;
  element.classList.add(...styles);
  if (children) element.append(...children);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', callback);
  return element;
};

export const h = ({
  id = undefined,
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
  element.textContent = text;
  element.style.textAlign = align;
  element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', callback);
  return element;
};

export const p = ({
  id = undefined,
  text = '',
  align = 'left',
  callback,
  styles = ['p'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  align?: 'center' | 'left' | 'right';
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLParagraphElement => {
  const element = document.createElement('p');
  if (id) element.id = id;
  element.textContent = text;
  element.style.textAlign = align;
  element.classList.add(...styles);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (callback) element.addEventListener('click', callback);

  return element;
};

export const a = ({
  id = undefined,
  text = '',
  href = '',
  target = '_self',
  children = undefined,
  callback,
  styles = ['a'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  children?: HTMLElement[];
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLAnchorElement => {
  const element = Object.assign(document.createElement('a'), {
    textContent: text,
    href,
    target,
    rel: target === '_blank' ? 'noopener noreferrer' : undefined,
  });
  if (id) element.id = id;
  if (children) element.append(...children);
  element.classList.add(...styles);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (callback) element.addEventListener('click', callback);

  return element;
};

export const button = ({
  id = undefined,
  text = '',
  type = 'button',
  disabled = false,

  callback,
  children = undefined,
  styles = ['button'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  type?: 'reset' | 'submit' | 'button';
  disabled?: boolean;
  callback?: EventListener;
  children?: HTMLElement[];

  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLButtonElement => {
  const element = Object.assign(document.createElement('button'), {
    textContent: text,
    type,
    disabled,
  });
  if (id) element.id = id;
  if (children) element.append(...children);
  element.classList.add(...styles);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (callback) element.addEventListener('click', callback);
  return element;
};

export const input = ({
  id = undefined,
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
    placeholder,
    type,
    value,
    disabled,
    title,
  });
  if (id) element.id = id;
  if (list) element.setAttribute('list', list);
  if (styles.length > 0) element.classList.add(...styles);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (callback) element.addEventListener(eventType, callback);

  return element;
};

export const datalist = ({
  id = undefined,
  children,
  styles = ['datalist'],
  attributes = {},
}: {
  id?: string;
  children?: HTMLElement[];
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLDataListElement => {
  const element = document.createElement('datalist');
  if (id) element.id = id;

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
  if (callback) input.addEventListener('input', callback);
  return input;
};

export const label = ({
  id = undefined,
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
  const element: HTMLLabelElement = Object.assign(document.createElement('label'), {
    textContent: text,
    htmlFor,
  });
  if (id) element.id = id;
  element.classList.add(...styles);
  if (callback) element.addEventListener('click', callback);
  return element;
};

export const select = ({
  id = '',
  disabled = false,
  children = undefined,
  callback = undefined,
  styles = ['select'],
  attributes = {},
}: {
  id?: string;
  disabled?: boolean;
  children?: HTMLElement[];
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLSelectElement => {
  const element: HTMLSelectElement = document.createElement('select');
  if (id) element.id = id;
  if (disabled) element.disabled = disabled;
  if (children) element.append(...children);
  element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('change', callback);
  return element;
};

export const option = ({
  id = undefined,
  text = '',
  value = '',
  disabled = undefined,
  callback = undefined,
  styles = ['option'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  value?: string;
  disabled?: boolean;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLOptionElement => {
  const element: HTMLOptionElement = document.createElement('option');
  if (id) element.id = id;
  if (value) element.value = value;
  element.textContent = text;
  if (disabled) element.disabled = disabled;
  element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('select', callback);
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
  if (callback) element.addEventListener('click', callback);
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
  if (callback) element.addEventListener('click', callback);
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
  if (callback) element.addEventListener('click', callback);

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
  if (callback) element.addEventListener('click', callback);
  return element;
};

// export const ul = (
//   tag = 'ul',
//   id = '',
//   text = '',
//   callback: EventListener | undefined = undefined
// ): HTMLElement => {
//   const ul: HTMLElement = document.createElement('ul');
//   ul.id = id;
//   ul.textContent = text;
//   ul.classList.add(tag);
//   if (callback) ul.addEventListener('click', callback);
//   return ul;
// };

export const ul = ({
  id = undefined,
  children = undefined,
  callback = undefined,
  styles = ['ul'],
  attributes = undefined,
}: {
  id?: string;
  children?: HTMLElement[];
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLUListElement => {
  const element: HTMLUListElement = document.createElement('ul');
  if (id) element.id = id;
  if (children) element.append(...children);
  element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', callback);
  return element;
};

export const li = ({
  id = undefined,
  value = undefined,
  children = undefined,
  callback = undefined,
  styles = ['li'],
  attributes = undefined,
}: {
  id?: string;
  value?: number;
  children?: HTMLElement[];
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLLIElement => {
  const element: HTMLLIElement = document.createElement('li');
  if (id) element.id = id;
  if (value) element.value = value;
  if (children) element.append(...children);
  element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', callback);
  return element;
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
  element.textContent = text;
  element.classList.add(...styles);
  if (children) element.append(...children);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', callback);
  return element;
};

export const form = ({
  id = undefined,
  text = '',
  children = undefined,
  callback = undefined,
  styles = ['form'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  children?: HTMLElement[];
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLFormElement => {
  const element: HTMLFormElement = document.createElement('form');
  if (id) element.id = id;
  element.textContent = text;
  element.classList.add(...styles);
  if (children) element.append(...children);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', callback);
  return element;
};

export const textArea = ({
  id = undefined,
  text = '',
  placeholder = undefined,
  callback = undefined,
  styles = ['textarea'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  placeholder?: string;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLTextAreaElement => {
  const element: HTMLTextAreaElement = document.createElement('textarea');
  if (id) element.id = id;
  if (placeholder) element.placeholder = placeholder;
  element.textContent = text;
  element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('input', callback);
  return element;
};

export const createElement = (tag = 'div'): HTMLElement => {
  return document.createElement(tag);
};
