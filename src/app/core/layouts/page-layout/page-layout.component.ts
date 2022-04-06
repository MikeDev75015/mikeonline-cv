import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

/**
 * The component of the page layout
 */
@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent implements OnInit, OnChanges {
  @Input() isLoadingData$: Observable<boolean> = of(true);

  @Input() sectionId: string | undefined;

  @Input() pageTitle: string | undefined;

  @Input() elementsNumber?: number;

  public titleParts: string[] = [];

  /**
   * @ignore
   * @param translateService
   */
  constructor(
    private readonly translateService: TranslateService,
  ) {
  }

  /**
   * @throws an error if sectionId and/or pageTitle are missing or invalid
   */
  ngOnInit(): void {
    if (!this.sectionId || !this.pageTitle) {
      throw new Error('sectionId and/or pageTitle are missing or invalid');
    }
  }

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['pageTitle'] && changes['pageTitle'].currentValue) {
      this.translateService.get(this.pageTitle as string).subscribe(
        (title) => {
          const spaceSplit = title.split(' ');
          this.titleParts = spaceSplit.map((part: string) => {
            if (part.includes("'")) {
              const subPart = part.split("'");
              return subPart.map((p, i) => {
                if (i === (subPart.length -1)) {
                  return p;
                }
                return [p, "'"];
              });
            }

            return part;
          }).flat(3);
        }
      );
    }
  }
}
