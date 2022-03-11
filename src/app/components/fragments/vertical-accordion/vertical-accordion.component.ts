import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAnimationServiceResponse } from '../../../core/core-index';
import { AnimationsService } from '../../../core/services/animations/animations.service';
import { UtilsService } from '../../../shared/services/utils/utils.service';
import { IN_OUT_TEMPLATE_ANIMATION } from '../../../shared/shared-index';

const getMinWidthByWindowInnerWidth = (): '100px' | '50px' => {
  return window.innerWidth > 840 ? '100px' : '50px';
};

const getMinWidthByDocumentClientWidth = (): '100px' | '50px' => {
  return document.body.clientWidth > 840 ? '100px' : '50px';
};

const adaptMinWidth = (): '100px' | '50px' => {
  return window.innerWidth
    ? getMinWidthByWindowInnerWidth()
    : getMinWidthByDocumentClientWidth();
};

const calculateWidth = (): string => {
  return window.innerWidth
    ? (window.innerWidth * 80 / 100) + 'px'
    : (document.body.clientWidth * 80 / 100) + 'px';
};

@Component({
  selector: 'app-vertical-accordion',
  templateUrl: './vertical-accordion.component.html',
  styleUrls: ['./vertical-accordion.component.scss'],
  animations: [
    ...IN_OUT_TEMPLATE_ANIMATION(
      'VerticalAccordionItem',
      true,
      { in: 500, out: 600 },
      {
        style: { minWidth: '{{minWidthOpened}}', maxWidth: calculateWidth() },
        options: { params: { minWidthOpened: calculateWidth() } },
      },
      {
        style: { minWidth: adaptMinWidth(), maxWidth: '{{minWidthClosed}}' },
        options: { params: { minWidthClosed: adaptMinWidth() } },
      },
      { in: 0, out: 0 },
      { style: { minWidth: '250px' } },
      { style: { minWidth: adaptMinWidth() } },
    ),
  ],
})
export class VerticalAccordionComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() itemList: any[] = [];

  @Input() verticalAccordionContainerClass = '';

  @Input() verticalAccordionItemClass = '';

  @Input() options = {};

  public minWidthOpened = '300px';

  public minWidthClosed = '50px';

  private verticalAccordionItemStateDictionary: { [key: string]: any } = {};

  private itemToOpen = '';

  private itemToClose = '';

  private elementId = '';

  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly utilService: UtilsService,
    private readonly animationService: AnimationsService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  private static calculateItemMaxWidth(percent: number): string {
    if (window.innerWidth) return (window.innerWidth * percent / 100) + 'px';
    else return (document.body.clientWidth * percent / 100) + 'px';
  }

  private static returnExpectedItemMinWidth(): '100px' | '50px' {
    return window.innerWidth ? getMinWidthByWindowInnerWidth() : getMinWidthByDocumentClientWidth();
  }

  ngOnInit(): void {
    if (
      this.itemList &&
      this.itemList.length
    ) this.createVerticalAccordionItemStateDictionary(this.itemList);

    const animationServiceSubscription = this.animationService.watchResponse()
      .subscribe(
        animationServiceResponse => this.onAnimationServiceResponse(animationServiceResponse),
      );
    this.subscriptionList.push(animationServiceSubscription);

    window.addEventListener('resize', () => {
      this.updateVerticalAccordionItemMinWidth();
    });
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  ngAfterViewChecked(): void {
    this.updateVerticalAccordionItemMinWidth();
    this.cdRef.detectChanges();
  }

  public onAnimation(e: any, i: number): void {
    this.elementId = 'vertical-accordion-item' + i;
    this.animationService.onPhase(e, this.elementId);
  }

  public updateVerticalAccordionItemState(index: number, state: boolean): void {
    if (state) {
      const keyList = Object.keys(this.verticalAccordionItemStateDictionary);
      this.itemToOpen = keyList[index];
      this.itemToClose = keyList.find((key) => this.verticalAccordionItemStateDictionary[key]) as string;

      if (!this.itemToClose) {
        this.itemToClose = '';
        this.setItemState(this.itemToOpen, true);
        setTimeout(() => this.itemToOpen = '', 550);
        return;
      }

      this.setItemState(this.itemToClose, false);
    }
  }

  public getItemState(index: number): boolean {
    return this.verticalAccordionItemStateDictionary['vertical-accordion-item' + index];
  }

  public isItemToClose(index: number): boolean {
    return this.itemToClose
      ? (+this.itemToClose.replace('vertical-accordion-item', '')) === index
      : false;
  }

  public isItemToOpen(index: number): boolean {
    return this.itemToOpen
      ? (+this.itemToOpen.replace('vertical-accordion-item', '')) === index
      : false;
  }

  private setItemState(item: string, state: boolean): void {
    this.verticalAccordionItemStateDictionary[item] = state;
  }

  private updateVerticalAccordionItemMinWidth(): void {
    this.minWidthOpened = VerticalAccordionComponent.calculateItemMaxWidth(50);
    const minWidthExpected = VerticalAccordionComponent.returnExpectedItemMinWidth();
    if (this.minWidthClosed !== minWidthExpected) {
      this.minWidthClosed = minWidthExpected;
    }
  }

  private createVerticalAccordionItemStateDictionary(itemList: any[]): void {
    itemList.forEach(
      (item, i) =>
        this.verticalAccordionItemStateDictionary['vertical-accordion-item' + i] = false, // (i === 0)
    );
  }

  private onAnimationServiceResponse(animationServiceResponse: IAnimationServiceResponse): void {
    if (
      !animationServiceResponse.type ||
      !animationServiceResponse.type.includes('vertical-accordion-item')
    ) return;

    if (animationServiceResponse.type.includes('start')) {
      if (
        animationServiceResponse.type.includes('VerticalAccordionItemComponentBodyInOut') &&
        animationServiceResponse.type.includes('out') &&
        animationServiceResponse.type.includes(this.itemToClose)
      ) {
        setTimeout(() => {
          this.itemToClose = '';
          setTimeout(() => {
            this.verticalAccordionItemStateDictionary[this.itemToOpen] = true;
            setTimeout(() => this.itemToOpen = '', 450);
          }, 600);
        }, 200);
      }
    }
  }
}
