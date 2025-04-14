import './404.css';

import * as create from '../../builder/elements';

export const notFoundView = (): HTMLElement => {
  const page: HTMLElement = create.section({
    id: 'main',
    tag: 'main',
  });
  const h1: HTMLHeadingElement = create.h({ id: 'h1', tag: 'h1', text: 'Wrong page! Error - 404' });
  const button: HTMLAnchorElement = create.a({
    id: 'btn-return',
    text: 'Return to Garage',
    href: '/',
    attributes: { 'data-router-link': '' },
  });
  page.append(h1, button);

  return page;
};
