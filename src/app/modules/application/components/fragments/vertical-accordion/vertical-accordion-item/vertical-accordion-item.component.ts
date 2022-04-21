import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { InterestV1 } from '../../../../../../core/interfaces/models/v1/interest.interface';
import { IAnimationServiceResponse, IN_OUT_TEMPLATE_ANIMATION } from '../../../../../../shared';
import { AnimationsService } from '../../../../../../shared/services/animations/animations.service';

@Component({
  selector: 'app-vertical-accordion-item',
  templateUrl: './vertical-accordion-item.component.html',
  animations: [
    ...IN_OUT_TEMPLATE_ANIMATION(
      'VerticalAccordionItemComponentBody',
      false,
      { in: 500, out: 250 },
      { style: { opacity: 1 } },
      { style: { opacity: 0 } },
    ),
  ],
})
export class VerticalAccordionItemComponent implements OnInit, AfterViewChecked {
  @Input() lastItem = false;

  @Input() itemData!: InterestV1;

  @Input() itemClass = '';

  @Input() expanded = false;

  @Output() open = new EventEmitter<boolean>();

  private elementId = '';

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly animationService: AnimationsService,
  ) {
  }

  ngOnInit(): void {
    const animationServiceSubscription = this.animationService.watchResponse()
      .subscribe(
        animationServiceResponse => this.onAnimationServiceResponse(animationServiceResponse),
      );
    this.subscriptionList.push(animationServiceSubscription);
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  public onAnimation(e: any): void {
    if (!this.elementId) {
      this.elementId = e.element.parentElement.parentElement.id;
    }
    this.animationService.onPhase(e, this.elementId);
  }

  public onOpenItem(): void {
    this.open.emit(true);
  }

  private onAnimationServiceResponse(animationServiceResponse: IAnimationServiceResponse): void {
    if (
      !this.elementId ||
      !animationServiceResponse.type ||
      !animationServiceResponse.type.includes(this.elementId)
    ) {
      return;
    }
  }
}
