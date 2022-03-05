import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import { IAnimationServiceResponse } from '../../../../core';
import { IInterest } from '../../../../core/interfaces/models/interest.interface';
import { AnimationsService } from '../../../../core/services/animations/animations.service';
import { IN_OUT_TEMPLATE_ANIMATION } from '../../../../shared';

@Component({
  selector: 'app-vertical-accordion-last-item',
  templateUrl: './vertical-accordion-last-item.component.html',
  styleUrls: ['./vertical-accordion-last-item.component.scss'],
  animations: [
    ...IN_OUT_TEMPLATE_ANIMATION(
      'VerticalAccordionItemComponentBody',
      false,
      { in: 500, out: 250 },
      { style: { opacity: 1 }},
      { style: { opacity: 0 }}
    )
  ]
})
export class VerticalAccordionLastItemComponent implements OnInit, AfterViewChecked {
  subscriptionList: Subscription[] = [];
  elementId = '';

  @Input() itemClass = '';
  @Input() itemData: IInterest = {} as IInterest;
  @Input() expanded = false;

  @Output() open = new EventEmitter<boolean>();

  constructor(
    private readonly cdref: ChangeDetectorRef,
    private readonly animationService: AnimationsService
  ) {}

  ngOnInit() {
    const animationServiceSubscription = this.animationService.watchResponse()
      .subscribe(
        animationServiceResponse => this.onAnimationServiceResponse(animationServiceResponse)
      );
    this.subscriptionList.push(animationServiceSubscription);
  }

  ngOnDestroy() {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  private onAnimationServiceResponse(animationServiceResponse: IAnimationServiceResponse): void {
    if (
      !this.elementId ||
      !animationServiceResponse.type ||
      !animationServiceResponse.type.includes(this.elementId)
    ) return;
  }

  public onAnimation(e: any): void {
    if (!this.elementId) this.elementId = e.element.parentElement.parentElement.id;
    this.animationService.onPhase(e, this.elementId);
  }

  openLink(): void {
    window.open(this.itemData.link.url, '_blank');
  }

  onOpenItem() {
    this.open.emit(true);
  }

  ngAfterViewChecked(): void {
    this.cdref.detectChanges();
  }

}
