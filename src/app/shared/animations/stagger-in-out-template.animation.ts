import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

/**
 * Payload interface to pass to define a state
 */
interface IInOutPayload {
  style: any;
  options?: {
    params: any;
  }
}

/**
 * Payload interface to pass to specify the transition times
 */
interface IDelay {
  in: number | string;
  out: number | string;
}

/**
 * Default payload representing input state
 */
const defaultInPayload = {style: {opacity: 1, transform: 'none'}};
/**
 * Default payload representing the exit state
 */
const defaultOutPayload = {style: {opacity: 0, transform: 'translateY(-100px)'}};
/**
 * Default payload for transition times
 */
const defaultDelay = {in: 400, out: 400};
/**
 * Default payload for stagger times
 */
const defaultTimings = {in: '50ms', out: '50ms'};

/**
 * Returns the animation pipeline built with the values passed or those by default
 * By default, the animations are fade in and fade out, all you have to do is enter
 * the name of the component.
 *
 * @param component, the component or element where the animation is located
 * @param delay, the payload to specify the incoming and outgoing delays, 500ms by default
 * @param inPayload, the payload representing input state, opacity at 1 by default
 * @param outPayload, the payload representing the exit state, opacity at 0 by default
 * @constructor
 */
export function STAGGER_IN_OUT_TEMPLATE_ANIMATION(
  component: string,
  delay: IDelay = defaultDelay,
  staggerDelay: IDelay = defaultTimings,
  inPayload: IInOutPayload = defaultInPayload,
  outPayload: IInOutPayload = defaultOutPayload,
) {
  return [
    trigger(component + 'InOut', [
      transition('* <=> *', [

        query(':enter', [
          style(outPayload.style),
          stagger(staggerDelay.in, [
            animate(delay.in, style(inPayload.style))
          ])
        ], {optional: true}),

        query(':leave', [
          style(inPayload.style),
          stagger(staggerDelay.out, [
            animate(delay.out, style(outPayload.style))
          ])
        ], {optional: true})

      ])
    ])
  ];
}
