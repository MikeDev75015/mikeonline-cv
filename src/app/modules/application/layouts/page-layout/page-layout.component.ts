import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';

/**
 * The component of the page layout
 */
@Component({
    selector: 'app-page-layout',
    templateUrl: './page-layout.component.html',
    providers: [MessageService],
    standalone: false
})
export class PageLayoutComponent implements OnInit {
  @Input() isLoadingData$: Observable<boolean> = of(true);

  @Input() sectionId!: string;

  @Input() pageTitle!: string;

  @Input() elementsNumber?: number;

  @Input() scrollSection?: boolean;

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
    if (!this.sectionId || this.pageTitle === undefined) {
      throw new Error('sectionId and/or pageTitle are missing or invalid');
    }

    if (this.pageTitle !== '') {
      this.translateService.get(this.pageTitle).subscribe(
        (title) => {
          const spaceSplit = title.split(' ');
          this.titleParts = spaceSplit.map((part: string) => {
            if (part.includes('\'')) {
              const subPart = part.split('\'');
              return subPart.map((p, i) => {
                if (i === (subPart.length - 1)) {
                  return p;
                }
                return [p, '\''];
              });
            }

            return part;
          }).flat(3);
        },
      );
    }
  }
}
