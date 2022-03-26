import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import { UtilsService } from '../../../shared/services/utils/utils.service';
import { IAnimationAction } from '../../interfaces/animation-action.interface';
import { IAnimationServiceResponse } from '../../interfaces/animation-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AnimationsService {
  private readonly onAnimationAction: BehaviorSubject<IAnimationServiceResponse> = new BehaviorSubject<IAnimationServiceResponse>({ type: '', params: {} });

  constructor(
    private readonly utilsService: UtilsService,
  ) {
  }

  public watchResponse(): Subject<IAnimationServiceResponse> {
    return this.onAnimationAction;
  }

  public onPhase(e: any, id = ''): void {
    const type = `${e.triggerName}-${e.toState}-${e.phaseName}`;
    if (e.triggerName === 'hideShowHeader') {
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
      return;
    }


    if (!id) {
      id = this.utilsService.getElementId(e.element);
    }

    if (e.fromState === 'void' || !id) {
      return;
    }
    this.onAnimationAction.next({ type: `${id}_${type}`});
  }

  private processAction(action: IAnimationAction): void {
    const actionType = action ? Object.keys(action)[0] : '';
    if (actionType !== 'style') {
      console.warn(`No switch case for ${actionType} action!`);
      return;
    }

    const element = action.style ? document.querySelector(action.style.selector) as HTMLElement : undefined;
    if (!element) {
      return;
    }

    if (action.style && action.style.classList) {
      action.style.classList.forEach((c) => {
        // @ts-ignore
        element.classList[c.method](c.name);
      });
    }
    if (action.style && action.style.propertyList) {
      action.style.propertyList.forEach((p) => {
        // @ts-ignore
        element.style[p.name] = p.value;
      });
    }
  }
}
