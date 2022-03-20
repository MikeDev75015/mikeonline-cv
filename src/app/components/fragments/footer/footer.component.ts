import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactOpenCloseService } from '../../../core/services/contact-open-close/contact-open-close.service';
import { DataService } from '../../../shared/services/data/data.service';

interface ITile {
  cols: number;

  rows: number;

  background: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() hideHeader = true;

  @Input() mobile = false;

  @Output() showHeader = new EventEmitter<boolean>();

  public isLoadingData: boolean | undefined;

  public heightIsTooSmall = false;

  public readonly classicTiles: ITile[] = [
    { // left => CV pdf
      cols: 1, rows: 1, background: 'white',
    },
    { // bottom => Copyright
      cols: 3, rows: 1, background: 'transparent',
    },
  ];

  public readonly mobileTiles: ITile[] = [
    { // bottom => Copyright
      cols: 2, rows: 1, background: 'transparent',
    },
    { // right => Contact
      cols: 1, rows: 1, background: '#024873',
    },
  ];

  private isContactOpen: boolean | undefined;

  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly contactOpenCloseService: ContactOpenCloseService,
    private readonly dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.isLoadingData = true;

    this.subscriptionList.push(
      this.contactOpenCloseService.onOpenCloseContactStatusChange().subscribe(status => {
        this.isContactOpen = status;
      }),
    );

    this.subscriptionList.push(
      this.contactOpenCloseService.onHeightIsTooSmallChange().subscribe(status => {
        if (this.heightIsTooSmall !== status) {
          this.heightIsTooSmall = status;
        }
      }),
    );

    this.subscriptionList.push(
      this.dataService.isAllDataLoaded().subscribe((isLoaded) => {
        if (!isLoaded) {
          return;
        }

        this.isLoadingData = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  public onShowHeader(): void {
    this.showHeader.emit(true);
  }

  public onOpenContact(): void {
    this.contactOpenCloseService.setOpenCloseContactStatus(!this.isContactOpen);
  }
}
