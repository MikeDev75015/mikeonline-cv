import { MessageSeverity } from './message-severity.type';

export interface TableWrapperMessage {
  message: string;

  severity: MessageSeverity;
}
