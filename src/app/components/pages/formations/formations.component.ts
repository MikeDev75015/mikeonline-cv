import {Component, OnInit} from '@angular/core';
import { IFormation } from '../../../core';
import { DataService } from '../../../shared/services/data/data.service';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss']
})
export class FormationsComponent implements OnInit {
  formationList: any[] = [];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit() {
    this.formationList = await this.dataService.getFormations<IFormation[]>();
  }
}
