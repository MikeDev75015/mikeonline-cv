import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IAnimationServiceResponse, IInterest } from '../../../../../core/core-index';
import { AnimationsService } from '../../../../../core/services/animations/animations.service';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import { IN_OUT_TEMPLATE_ANIMATION } from '../../../../../shared/shared-index';

const getMinWidthByWindowInnerWidth = (): '100px' | '50px' => {
  return window.innerWidth > 840 ? '100px' : '50px';
};

const getMinWidthByDocumentClientWidth = (): '100px' | '50px' => {
  return document.body.clientWidth > 840 ? '100px' : '50px';
};

const adaptItemMinWidth = (): '100px' | '50px' => {
  return window.innerWidth
    ? getMinWidthByWindowInnerWidth()
    : getMinWidthByDocumentClientWidth();
};

const calculateItemMaxWidth = (percent: number): string => {
  const widthPercent = window.innerWidth
    ? window.innerWidth * (percent / 100)
    : document.body.clientWidth * (percent / 100);
  const itemMinWidth = parseInt(adaptItemMinWidth(), 10);
  return `${widthPercent - (itemMinWidth * 2)}px`;
};

const verticalAccordionItemPercentParentWidth = 85;
const verticalAccordionItemMinWidth = adaptItemMinWidth();
const verticalAccordionItemMaxWidth = calculateItemMaxWidth(verticalAccordionItemPercentParentWidth);

@Component({
  selector: 'app-vertical-accordion',
  templateUrl: './vertical-accordion.component.html',
  animations: [
    ...IN_OUT_TEMPLATE_ANIMATION(
      'VerticalAccordionItem',
      true,
      { in: 500, out: 600 },
      {
        style: { width: '{{itemMaxWidth}}', minWidth: '{{itemMinWidth}}', maxWidth: '{{itemMaxWidth}}' },
        options: {
          params: {
            itemMinWidth: verticalAccordionItemMinWidth,
            itemMaxWidth: verticalAccordionItemMaxWidth,
          },
        },
      },
      {
        style: { width: '{{itemMinWidth}}', minWidth: '{{itemMinWidth}}', maxWidth: '{{itemMaxWidth}}' },
        options: {
          params: {
            itemMinWidth: verticalAccordionItemMinWidth,
            itemMaxWidth: verticalAccordionItemMaxWidth,
          },
        },
      },
      {
        voidDelay: { in: 0, out: 0 },
        voidInPayload: {
          style: { width: '{{itemMaxWidth}}', minWidth: '{{itemMinWidth}}', maxWidth: '{{itemMaxWidth}}' },
          options: {
            params: {
              itemMinWidth: verticalAccordionItemMinWidth,
              itemMaxWidth: verticalAccordionItemMaxWidth,
            },
          },
        },
        voidOutPayload: {
          style: { width: '{{itemMinWidth}}', minWidth: '{{itemMinWidth}}', maxWidth: '{{itemMaxWidth}}' },
          options: {
            params: {
              itemMinWidth: verticalAccordionItemMinWidth,
              itemMaxWidth: verticalAccordionItemMaxWidth,
            },
          },
        },
      },
    ),
  ],
})
export class VerticalAccordionComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() itemList: IInterest[] | undefined;

  @Input() verticalAccordionContainerClass = '';

  @Input() verticalAccordionItemClass = '';

  @Input() options = {};

  public itemMaxWidth: string | undefined;

  public itemMinWidth: string | undefined;

  public isRefreshing = false;

  private verticalAccordionItemStateDictionary: { [key: string]: any } = {};

  private itemToOpen = '';

  private itemToClose = '';

  private readonly selectorPrefix = 'vertical-accordion-item';

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly utilService: UtilsService,
    private readonly animationService: AnimationsService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['itemList'] && changes['itemList'].currentValue && changes['itemList'].currentValue.length) {
      this.updateVerticalAccordionItemMinWidth();
      this.createVerticalAccordionItemStateDictionary(this.itemList as IInterest[]);
    }
  }

  ngOnInit(): void {
    this.subscriptionList.push(
      this.animationService.watchResponse().subscribe(
        animationServiceResponse => this.onAnimationServiceResponse(animationServiceResponse),
      ),
    );

    window.addEventListener('resize', () => {
      this.updateVerticalAccordionItemMinWidth();
    });

    if (this.itemList && this.itemList.length) {
      this.updateVerticalAccordionItemMinWidth();
      this.createVerticalAccordionItemStateDictionary(this.itemList);
    }
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  ngAfterViewChecked(): void {
    this.updateVerticalAccordionItemMinWidth();
    this.cdRef.detectChanges();
  }

  public onAnimation(e: any, i: number): void {
    this.animationService.onPhase(e, this.selectorPrefix + i);
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
    return this.verticalAccordionItemStateDictionary[index];
  }

  public isItemToClose(index: number): boolean {
    return this.itemToClose
      ? +this.itemToClose === index
      : false;
  }

  public isItemToOpen(index: number): boolean {
    return this.itemToOpen
      ? (+this.itemToOpen.replace(this.selectorPrefix, '')) === index
      : false;
  }

  private setItemState(item: string, state: boolean): void {
    this.verticalAccordionItemStateDictionary[item] = state;
  }

  private updateVerticalAccordionItemMinWidth(): void {
    const itemMaxWidthExpected = calculateItemMaxWidth(verticalAccordionItemPercentParentWidth);
    const iTemMinWidthExpected = adaptItemMinWidth();
    if (this.itemMaxWidth !== itemMaxWidthExpected) {
      this.itemMaxWidth = itemMaxWidthExpected;
    }
    if (this.itemMinWidth !== iTemMinWidthExpected) {
      this.itemMinWidth = iTemMinWidthExpected;
    }
  }

  private createVerticalAccordionItemStateDictionary(itemList: any[]): void {
    itemList.forEach(
      (item, i) => this.verticalAccordionItemStateDictionary[i] = i === 0,
    );
  }

  private onAnimationServiceResponse(animationServiceResponse: IAnimationServiceResponse): void {
    if (!animationServiceResponse.type || !animationServiceResponse.type.includes(this.selectorPrefix)) {
      return;
    }

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
