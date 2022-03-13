import dayJS from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/fr';

dayJS.extend(utc);
dayJS.extend(timezone);
dayJS.locale('fr');

/**
 * DayJsService
 */
export class DayJsService {
  /**
   * Gets the current date or specified
   * @returns an ISO date by default or the specified format if provided
   */
  public static getDate(date: string | undefined, format = 'YYYY-MM-DD[T]HH:mm:ssZ'): string {
    return dayJS(date).tz('Europe/Paris').format(format);
  }
}
