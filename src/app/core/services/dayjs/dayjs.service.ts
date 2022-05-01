import dayJS from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayJS.extend(utc);
dayJS.extend(timezone);
dayJS.locale('fr');
dayJS.extend(relativeTime);

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
   * @param withoutSuffix
   */
  public static getTimeToNow(dateToConvert: string, withoutSuffix = false): string {
    const convertedDate = dayJS(dateToConvert).toNow(withoutSuffix);
    return convertedDate.replace('un ', '1 ');
  }

  /**
   * Returns relative time to x
   * @param startDate
   * @param endDate
   * @param withoutSuffix
   */
  public static getTimeToX(startDate: string, endDate: string, withoutSuffix = false): string {
    const convertedEndDate = dayJS(endDate);
    const timeToX = dayJS(startDate).to(convertedEndDate, true);
    return timeToX.replace('un ', '1 ');
  }
}
