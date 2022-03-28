import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
})
export class PageLayoutComponent {
  @Input() isLoadingData: Observable<boolean> = of(true);

  @Input() sectionId!: string;

  @Input() pageTitle!: string;

  @Input() elementsNumber?: number;
}
