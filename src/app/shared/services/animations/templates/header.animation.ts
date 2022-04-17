import { animate, state, style, transition, trigger } from '@angular/animations';

export const headerHeight = '{{ headerHeight }}';

export const HEADER_ANIMATION = [
  trigger('hideShowHeader', [
    transition('void => show', [
      style({
        opacity: 0.1,
        marginTop: 0,
        left: 0
      }),
      animate(2000, style({
        opacity: 1,
        marginTop: 0,
        left: 0
      }))
    ]),

    state('show', style({
      opacity: 1,
      marginTop: 0,
      left: 0
    })),
    state('hide', style({
      opacity: .5,
      marginTop: headerHeight,
      left: 0
    }), {params: {headerHeight: '0'}}),

    transition('hide => show', [
      style({
        opacity: .5,
        marginTop: headerHeight,
        left: 0
      }),
      animate(2000)
    ]),
    transition('* => hide', [
      animate(1000, style({
        opacity: .5,
        marginTop: headerHeight,
        left: 0
      }))
    ]),
  ])
];
