import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * The component of the page layout
 */
@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent implements OnInit {
  @Input() isLoadingData: Observable<boolean> = of(true);

  @Input() sectionId: string | undefined;

  @Input() pageTitle!: string;

  @Input() elementsNumber?: number;

  /**
   * @throws an error if sectionId and/or pageTitle are missing or invalid
   */
  public ngOnInit(): void {
    if (!this.sectionId || !this.pageTitle) {
      throw new Error('sectionId and/or pageTitle are missing or invalid');
    }
  }
}
