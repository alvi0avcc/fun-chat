import './footer.css';
import { section, a, label } from '../../builder/elements';

export const footer = (): HTMLElement => {
  return section({
    id: 'footer',
    styles: ['section', 'footer'],
    children: [
      a({
        text: 'RS School',
        href: 'https://rs.school/',
        target: '_blank',
        styles: ['a', 'footer-school-logo'],
      }),
      a({
        text: 'A.Vavilov',
        href: 'https://github.com/alvi0avcc',
        target: '_blank',
        styles: ['a', 'footer-my-logo'],
      }),
      label({ text: '2025' }),
    ],
  });
};
