import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormWrapperService {
  private formValue$: Subject<{ [key: string]: any; }> = new Subject<{ [key: string]: any; }>();

  public onFormValueChange(): Subject<{ [key: string]: any; }> {
    return this.formValue$;
  }

  public updateFormValue(formValue: { [key: string]: any; }): void {
    this.formValue$.next(formValue);
  }
}
