import dayJS from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayJS.extend(utc);
dayJS.extend(timezone);
dayJS.locale('fr');
dayJS.extend(relativeTime)

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

  /**
   * Returns relative time to now
   * @param dateToConvert
   * @param suffix
   */
  public static getTimeToNow(dateToConvert: string, suffix = false): string {
    const convertedDate = dayJS(dateToConvert).toNow(suffix);
    return convertedDate !== 'un an' ? convertedDate : '1 an';
  }
}
