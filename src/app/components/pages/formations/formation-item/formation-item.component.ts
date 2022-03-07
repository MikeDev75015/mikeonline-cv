import {AfterViewChecked, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import { IAnimationServiceResponse } from '../../../../core/core-index';
import { IFormation } from '../../../../core/interfaces/models/formation.interface';
import { AnimationsService } from '../../../../core/services/animations/animations.service';
import { IN_OUT_TEMPLATE_ANIMATION } from '../../../../shared/shared-index';
import { UtilsService } from '../../../../shared/services/utils/utils.service';

@Component({
  selector: 'app-formation-item',
  templateUrl: './formation-item.component.html',
  styleUrls: ['./formation-item.component.scss'],
  animations: [
    ...IN_OUT_TEMPLATE_ANIMATION(
      'FormationItemComponent',
      false,
      {in: 800, out: 700},
      {style: {maxHeight: '700px'}},
      {style: {maxHeight: '100px'}}
    ),
    ...IN_OUT_TEMPLATE_ANIMATION(
      'ClosedLayer',
      false
    )
  ]
})
export class FormationItemComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  subscriptionList: Subscription[] = [];

  @Input() form: IFormation | undefined;
  @Input() index = -1;
  enableOpenCloseButtons = false;
  opened = false;
  masked = true;
  elementId = '';
  btnOpen = true;
  overflow = '';
  lineBodyPaddingLeft = '30px';

  constructor(
    private readonly animationService: AnimationsService,
    private readonly utilsService: UtilsService
  ) {
  }

  private static showOpenCloseButtons(form: IFormation) {
    if (!form || !form.detailList || !form.detailList.length) {
      return false;
    }

    const totalDetailListLines = form.detailList.reduce((totalLine, detail) => {
      let lines = 0;
      if (detail.title) {
        lines++;
      }
      if (detail.lineList) {
        lines += detail.lineList.length;
      }
      totalLine += lines;
      return totalLine;
    }, 0);

    return totalDetailListLines > 4;
  }

  ngOnInit() {
    this.setLineBodyPaddingLeft();
    window.addEventListener('resize', () => {
      this.setLineBodyPaddingLeft();
    });

    const animationServiceSubscription = this.animationService.watchResponse()
      .subscribe(
        animationServiceResponse => this.onAnimationServiceResponse(animationServiceResponse)
      );
    this.subscriptionList.push(animationServiceSubscription);
  }

  private setLineBodyPaddingLeft(): void {
    this.lineBodyPaddingLeft = window.innerWidth > 840 ? '50px' : '30px';
  }

  ngOnDestroy() {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['form'] && changes['form'].currentValue) {
      this.enableOpenCloseButtons = FormationItemComponent.showOpenCloseButtons(changes['form'].currentValue);
    }
  }

  ngAfterViewChecked() {
    const compSection = document.querySelector('#COMPETENCES');
    const formSection = document.querySelector('#FORMATIONS');
    if (
      (formSection || compSection) &&
      !this.overflow
    ) {
      const detailListDiv = document.querySelector('#formation-detail-list-' + this.index);
      if (!detailListDiv) {
        return;
      }

      this.overflow = 'init';
      const detailListHeight = this.utilsService.convertPixelsToNumber(
        this.utilsService.getComputedProperty(detailListDiv, 'height')
      );
      this.overflow = detailListHeight > 570 ? 'auto' : 'hidden';
    }
  }

  public onAnimation(e: any): void {
    this.elementId = e.element.id
      ? e.element.id
      : e.element.parentElement.id
        ? e.element.parentElement.id
        : e.element.parentElement.parentElement.id
          ? e.element.parentElement.parentElement.id
          : e.element.parentElement.parentElement.parentElement.id;
    this.animationService.onPhase(e, this.elementId);
  }

  public toggleView(request: string): void {
    if (request === 'close') {
      this.masked = true;
      return;
    }

    this.opened = !this.opened;
  }

  private onAnimationServiceResponse(animationServiceResponse: IAnimationServiceResponse): void {
    if (
      !this.elementId ||
      !animationServiceResponse.type ||
      !animationServiceResponse.type.includes(this.elementId)
    ) {
      return;
    }

    if (animationServiceResponse.type.includes('done')) {
      if (animationServiceResponse.type.includes('FormationItemComponentInOut-in')) {
        this.masked = false;
      }
      if (animationServiceResponse.type.includes('FormationItemComponentInOut-out')) {
        this.btnOpen = true;
      }
      if (
        animationServiceResponse.type.includes('ClosedLayerInOut-in') &&
        this.opened
      ) {
        this.opened = false;
      }
    }
  }
}
