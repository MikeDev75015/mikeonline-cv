import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RadarConfig } from '../../models/radar-config.interface';

@Injectable({
  providedIn: 'root'
})
export class RadarConfigService {
  config: RadarConfig = {
    theme: 'lara-light-blue',
    dark: false,
    inputStyle: 'outlined',
    ripple: true
  };

  private configUpdate = new Subject<RadarConfig>();

  configUpdate$ = this.configUpdate.asObservable();

  updateConfig(config: RadarConfig) {
    this.config = config;
    this.configUpdate.next(config);
  }

  getConfig() {
    return this.config;
  }
}
