import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-dates',
  templateUrl: './item-dates.component.html',
  styleUrls: ['./item-dates.component.scss'],
})
export class ItemDatesComponent {
  @Input() item!: {
    startDate: string;
    endDate: string;
  };
}
