import { Subject } from 'rxjs';

export class ErrorMessageService {
  private static readonly message = new Subject<string>();

  public static onMessage(): Subject<string> {
    return this.message;
  }

  public static sendMessage(message: string): void {
    this.message.next(message);
  }
}
