import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RadarConfig } from '../../models/radar-config.interface';

@Injectable({
  providedIn: 'root',
})
export class RadarConfigService {
  private config: RadarConfig = {
    theme: 'lara-light-blue',
    dark: false,
    inputStyle: 'outlined',
    ripple: true,
  };

  private readonly configUpdateSubject = new Subject<RadarConfig>();

  public getConfig(): RadarConfig {
    return this.config;
  }

  public updateConfig(config: RadarConfig): void {
    this.config = config;
    this.configUpdateSubject.next(config);
  }

  public onConfigChanges(): Observable<RadarConfig> {
    return this.configUpdateSubject.asObservable();
  }
}
