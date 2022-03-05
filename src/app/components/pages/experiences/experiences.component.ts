import {Component, OnInit} from '@angular/core';
import { IExperience } from '../../../core';
import { DataService } from '../../../shared/services/data/data.service';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss']
})
export class ExperiencesComponent implements OnInit {
  experienceList: any[] = [];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit() {
    this.experienceList = await this.dataService.getExperiences<IExperience[]>();
  }
}
