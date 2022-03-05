import {animate, state, style, transition, trigger} from '@angular/animations';

/**
 * Payload interface to pass to define a state
 */
interface IInOutPayload {
  style: any;
  options?: {
    params: any;
  }
};

/**
 * Payload interface to pass to specify the transition times
 */
interface IDelay {
  in: number;
  out: number;
};
/**
 * Default payload representing input state
 */
const defaultInPayload = { style: { opacity: 1, display: 'block' }, options: { params: {} } };
/**
 * Default payload representing the exit state
 */
const defaultOutPayload = { style: { opacity: 0, display: 'none' }, options: { params: {} } };
/**
 * Default payload for transition times
 */
const defaultDelay = { in: 400, out: 400 };

/**
 * Returns the animation pipeline built with the values passed or those by default
 * By default, the animations are fade in and fade out, all you have to do is enter
 * the name of the component.
 *
 * @param component, the component or element where the animation is located
 * @param animateVoid, a boolean to activate or not the initial transitions, default to false
 * @param delay, the payload to specify the incoming and outgoing delays, 500ms by default
 * @param inPayload, the payload representing input state, opacity at 1 by default
 * @param outPayload, the payload representing the exit state, opacity at 0 by default
 * @param voidDelay, the payload to specify the incoming and outgoing delays for the initial transitions, null by default
 * @param voidInPayload, the payload representing the initial input state, null by default
 * @param voidOutPayload, the payload representing the initial exit state, null by default
 * @constructor
 */
export function IN_OUT_TEMPLATE_ANIMATION(
  component: string,
  animateVoid = false,
  delay: IDelay = defaultDelay,
  inPayload: IInOutPayload = defaultInPayload,
  outPayload: IInOutPayload = defaultOutPayload,
  voidDelay: IDelay | null = null,
  voidInPayload: IInOutPayload | null = null,
  voidOutPayload: IInOutPayload | null = null
) {
  return [
    trigger(component + 'InOut', [

      animateVoid
        ? transition('void => in', [
          style(voidInPayload? voidInPayload.style : inPayload.style),
          animate(voidDelay ? voidDelay.in : 0)])
        : state('voidIn',
            style(voidInPayload ? voidInPayload.style : inPayload.style),
        voidInPayload ? voidInPayload.options : inPayload.options),

      animateVoid
        ? transition('void => out', [
          style(voidOutPayload? voidOutPayload.style : outPayload.style),
          animate(voidDelay ? voidDelay.out : 0)])
        : state('voidOut',
            style(voidOutPayload ? voidOutPayload.style : outPayload.style),
        voidOutPayload ? voidOutPayload.options : outPayload.options),

      state('in', style(inPayload.style), inPayload.options),
      state('out', style(outPayload.style), outPayload.options),

      transition('out => in', [
        outPayload.style.display && outPayload.style.display === 'none'
          ? style({...outPayload.style, display: inPayload.style.display})
          : style(outPayload.style),
        animate(delay.in)
      ]),
      transition('in => out', [
        animate(delay.out)
      ]),
    ])
  ];

}
