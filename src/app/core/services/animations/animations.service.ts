import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import { IAnimationAction } from '../../interfaces/animation-action.interface';
import { IAnimationServiceResponse } from '../../interfaces/animation-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AnimationsService {
  onAnimationAction: Subject<IAnimationServiceResponse> = new BehaviorSubject<IAnimationServiceResponse>({type: '', params: {}});

  public watchResponse(): Subject<IAnimationServiceResponse> {
    return this.onAnimationAction;
  }

  public onPhase(e: any, id = ''): void {

    const type = e.triggerName + '-' + e.toState + '-' + e.phaseName;
    switch (e.triggerName) {
      case 'hideShowHeader': {
        if (e.toState === 'hide' && e.phaseName === 'start') {
          this.onAnimationAction.next({
            type: type
          });
        }
        if (e.toState === 'hide' && e.phaseName === 'done') {
          const actionList: IAnimationAction[] = [{
            style: {
              selector: '.app-main .mat-tab-group',
              classList: [{name: 'full-screen', method: 'add'}]
            }
          }];
          actionList.forEach(action => this.processAction(action));
          this.onAnimationAction.next({
            type: type,
            params: {
              actionList
            }
          });
        }
        if (e.toState === 'show' && e.phaseName === 'start') {
          const actionList: IAnimationAction[] = [{
            style: {
              selector: '.app-main .mat-tab-group',
              classList: [{name: 'full-screen', method: 'remove'}]
            }
          }];
          actionList.forEach(action => this.processAction(action));
          this.onAnimationAction.next({
            type: type,
            params: {
              actionList
            }
          });
        }
        break;
      }
      default: {
        if (!id) id = e.element.id;
        if (e.fromState === 'void' || !id) return;
        this.onAnimationAction.next({ type: id + '_' + type});
      }
    }
  }

  private processAction(action: IAnimationAction) {
    const actionType = Object.keys(action)[0];

    switch (actionType) {
      case 'style': {
        const element = document.querySelector(action!.style!.selector) as HTMLElement;
        if (!element) { return; }

        if (action!.style!.classList) {
          // @ts-ignore
          action!.style!.classList.forEach((c: { name: string; method: string; }) => element.classList[c.method](c.name));
        }
        if (action!.style!.propertyList) {
          // @ts-ignore
          action!.style!.propertyList.forEach(p => element.style[p.name] = p.value);
        }
        break;
      }
      default: console.log('No switch case for ' + actionType + ' action!');
    }
  }
}
