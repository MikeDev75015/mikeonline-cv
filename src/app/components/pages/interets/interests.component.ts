import {Component, OnInit} from '@angular/core';
import { IInterest } from '../../../core';
import { DataService } from '../../../shared/services/data/data.service';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent implements OnInit {
  interestList: IInterest[] = [];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit() {
    this.interestList = await this.dataService.getInterests<IInterest[]>();
  }
}
