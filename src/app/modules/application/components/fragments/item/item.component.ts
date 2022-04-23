import { AfterViewChecked, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExperienceV1 } from '../../../../../core/interfaces/models/v1/experience.interface';
import { FormationV1 } from '../../../../../core/interfaces/models/v1/formation.interface';
import { IAnimationServiceResponse, IN_OUT_TEMPLATE_ANIMATION, UtilsService } from '../../../../../shared';
import { AnimationsService } from '../../../../../shared/services/animations/animations.service';
import { TemplatesService } from '../../../../../shared/services/templates/templates.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  animations: [
    ...IN_OUT_TEMPLATE_ANIMATION(
      'ItemComponent',
      false,
      { in: 800, out: 700 },
      { style: { maxHeight: '600px' } },
      { style: { maxHeight: '100px' } },
    ),
    ...IN_OUT_TEMPLATE_ANIMATION(
      'ClosedLayer',
      false,
    ),
  ],
})
export class ItemComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() itemData: ExperienceV1 | FormationV1 | undefined;

  @Input() index = -1;

  @Input() itemType: 'experienceItem' | 'formationItem' | undefined;

  @Input() showDetails = false;

  public enableOpenCloseButtons = false;

  public opened = false;

  public masked = true;

  public btnOpen = true;

  public overflow = '';

  public lineBodyPaddingLeft = '30px';

  private elementId = '';

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly animationService: AnimationsService,
    private readonly utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.subscriptionList.push(this.animationService.watchResponse().subscribe(
      animationServiceResponse => this.onAnimationServiceResponse(animationServiceResponse),
    ));

    this.lineBodyPaddingLeft = TemplatesService.setLineBodyPaddingLeft();

    window.addEventListener('resize', () => {
      this.lineBodyPaddingLeft = TemplatesService.setLineBodyPaddingLeft();
    });
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(s => s.unsubscribe());

    window.removeEventListener('resize', () => {
      this.lineBodyPaddingLeft = TemplatesService.setLineBodyPaddingLeft();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['itemData'] && changes['itemData'].currentValue) {
      this.enableOpenCloseButtons = TemplatesService.showOpenCloseButtons(changes['itemData'].currentValue);
    }
  }

  ngAfterViewChecked(): void {
    const compSection = document.querySelector('#SKILLS');
    const expSection = document.querySelector('#EXPERIENCES');
    const formSection = document.querySelector('#FORMATIONS');
    if (
      (compSection || expSection || formSection) &&
      !this.overflow
    ) {
      const detailListDiv = document.querySelector('#detail-list-' + this.index);
      if (!detailListDiv) {
        return;
      }

      this.overflow = 'init';
      const detailListHeight = this.utilsService.convertPixelsToNumber(
        this.utilsService.getComputedProperty(detailListDiv, 'height'),
      );
      this.overflow = detailListHeight > 570 ? 'auto' : 'hidden';
    }
  }

  public onAnimation(e: any): void {
    this.elementId = this.utilsService.getElementId(e.element);
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
      if (animationServiceResponse.type.includes('ItemComponentInOut-in')) {
        this.masked = false;
      }
      if (animationServiceResponse.type.includes('ItemComponentInOut-out')) {
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
