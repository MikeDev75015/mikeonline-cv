import {AfterViewChecked, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import { IAnimationServiceResponse } from '../../../../core/core-index';
import { IExperience } from '../../../../core/interfaces/models/experience.interface';
import { AnimationsService } from '../../../../core/services/animations/animations.service';
import { IN_OUT_TEMPLATE_ANIMATION } from '../../../../shared/shared-index';
import { UtilsService } from '../../../../shared/services/utils/utils.service';

@Component({
  selector: 'app-experience-item',
  templateUrl: './experience-item.component.html',
  styleUrls: ['./experience-item.component.scss'],
  animations: [
    ...IN_OUT_TEMPLATE_ANIMATION(
      'ExperienceItemComponent',
      false,
      {in: 800, out: 700},
      {style: {maxHeight: '600px'}},
      {style: {maxHeight: '100px'}}
    ),
    ...IN_OUT_TEMPLATE_ANIMATION(
      'ClosedLayer',
      false
    )
  ]
})
export class ExperienceItemComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  subscriptionList: Subscription[] = [];

  @Input() exp: IExperience = {} as IExperience;
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

  private static showOpenCloseButtons(exp: IExperience) {
    if (!exp || !exp.detailList || !exp.detailList.length) {
      return false;
    }

    const totalDetailListLines = exp.detailList.reduce((totalLine, detail) => {
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

  ngOnInit(): void {
    this.lineBodyPaddingLeft = window.innerWidth > 840 ? '50px' : '30px';
    window.addEventListener('resize', () => this.lineBodyPaddingLeft = window.innerWidth > 840 ? '50px' : '30px');

    const animationServiceSubscription = this.animationService.watchResponse()
      .subscribe(
        animationServiceResponse => this.onAnimationServiceResponse(animationServiceResponse)
      );
    this.subscriptionList.push(animationServiceSubscription);
  }

  ngOnDestroy() {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['exp'] && changes['exp'].currentValue) {
      this.enableOpenCloseButtons = ExperienceItemComponent.showOpenCloseButtons(changes['exp'].currentValue);
    }
  }

  ngAfterViewChecked(): void {
    const compSection = document.querySelector('#COMPETENCES');
    const expSection = document.querySelector('#EXPERIENCES');
    if (
      (expSection || compSection) &&
      !this.overflow
    ) {
      const detailListDiv = document.querySelector('#experience-detail-list-' + this.index);
      if (!detailListDiv) {
        return;
      }

      this.overflow = 'init';
      const detailListHeight = this.utilsService.convertPixelsToNumber(
        this.utilsService.getComputedProperty(detailListDiv, 'height')
      );
      this.overflow = detailListHeight > 570 ? 'auto' : 'hidden';
      // console.log('detailListDiv ' + this.index + ' height:', detailListHeight, '\noverflow:', this.overflow);
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
      if (animationServiceResponse.type.includes('ExperienceItemComponentInOut-in')) {
        this.masked = false;
      }
      if (animationServiceResponse.type.includes('ExperienceItemComponentInOut-out')) {
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
