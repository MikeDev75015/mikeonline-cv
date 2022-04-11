import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-dates',
  templateUrl: './item-dates.component.html',
})
export class ItemDatesComponent {
  @Input() item!: {
    startDate: string;
    endDate: string;
  };
}
