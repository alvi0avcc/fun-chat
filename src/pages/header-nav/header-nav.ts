import './header-nav.css';

import { section, a } from '../../builder/elements';

export const header = section({
  id: 'header-nav',
  tag: 'header',
  children: [
    a({
      id: 'link-login',
      text: 'TO LOGIN PAGE',
      href: '/',
      attributes: { 'data-router-link': '' },
      styles: ['button'],
    }),
    a({
      id: 'link-chat',
      text: 'TO CHAT PAGE',
      href: '/chat',
      attributes: { 'data-router-link': '' },
      styles: ['button'],
    }),
    a({
      id: 'link-about',
      text: 'TO ABOUT PAGE',
      href: '/about',
      attributes: { 'data-router-link': '' },
      styles: ['button'],
    }),
  ],
});
