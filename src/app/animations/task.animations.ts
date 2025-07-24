import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export const taskAnimations = [
  // Animation for task deletion
  trigger('taskDelete', [
    state(
      'in',
      style({
        opacity: 1,
        transform: 'translateX(0) scale(1)',
        height: '*',
        marginBottom: '0.5rem',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
      }),
    ),
    transition('* => void', [
      animate(
        '300ms ease-in',
        keyframes([
          style({
            opacity: 1,
            transform: 'translateX(0) scale(1)',
            offset: 0,
          }),
          style({
            opacity: 0.7,
            transform: 'translateX(-10px) scale(0.98)',
            offset: 0.3,
          }),
          style({
            opacity: 0,
            transform: 'translateX(-100px) scale(0.8)',
            height: '0',
            marginBottom: '0',
            paddingTop: '0',
            paddingBottom: '0',
            offset: 1,
          }),
        ]),
      ),
    ]),
  ]),

  // Animation for task addition
  trigger('taskAdd', [
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'translateX(100px) scale(0.8)',
        height: '0',
        marginBottom: '0',
        paddingTop: '0',
        paddingBottom: '0',
      }),
      animate(
        '400ms ease-out',
        keyframes([
          style({
            opacity: 0,
            transform: 'translateX(100px) scale(0.8)',
            height: '0',
            marginBottom: '0',
            paddingTop: '0',
            paddingBottom: '0',
            offset: 0,
          }),
          style({
            opacity: 0.3,
            transform: 'translateX(10px) scale(0.95)',
            height: '*',
            marginBottom: '0.5rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            offset: 0.7,
          }),
          style({
            opacity: 1,
            transform: 'translateX(0) scale(1)',
            offset: 1,
          }),
        ]),
      ),
    ]),
  ]),

  // Shake animation for validation errors
  trigger('shake', [
    transition('* => *', [
      animate(
        '500ms ease-in-out',
        keyframes([
          style({ transform: 'translateX(0)', offset: 0 }),
          style({ transform: 'translateX(-5px)', offset: 0.1 }),
          style({ transform: 'translateX(5px)', offset: 0.2 }),
          style({ transform: 'translateX(-5px)', offset: 0.3 }),
          style({ transform: 'translateX(5px)', offset: 0.4 }),
          style({ transform: 'translateX(-5px)', offset: 0.5 }),
          style({ transform: 'translateX(5px)', offset: 0.6 }),
          style({ transform: 'translateX(-5px)', offset: 0.7 }),
          style({ transform: 'translateX(5px)', offset: 0.8 }),
          style({ transform: 'translateX(0)', offset: 1 }),
        ]),
      ),
    ]),
  ]),
];
