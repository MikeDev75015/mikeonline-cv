import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TableWrapperMessage } from '../interfaces/table-wrapper-message.interface';

@Injectable({
  providedIn: 'root',
})
export class TableWrapperService {
  private static readonly message = new Subject<TableWrapperMessage>();

  public static onMessage(): Subject<TableWrapperMessage> {
    return this.message;
  }

  public static sendMessage(tableMessage: TableWrapperMessage): void {
    this.message.next(tableMessage);
  }
}
