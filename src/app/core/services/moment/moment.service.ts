import moment from 'moment';
import { MomentUnit } from './models/moment-unit';
import { MomentDateComparedResult } from './models/moment-date-compared-result';

/**
 * Service for dates using the moment.js library
 */
export class MomentService {
  /**
   * Gets the date in moment format
   * @param date Optional. The date to to return
   */
  public static getMoment(date?: string): moment.Moment {
    return moment(date);
  }

  /**
   * Gets the current date
   * @param format The expected format
   * @returns an ISO date by default
   */
  public static getCurrentDate(format?: string): string {
    return moment()
    .locale('fr')
    .format(format);
  }

  /**
   * Gets the formatted date
   * @param date
   * @param format The expected format
   * @returns an ISO date by default
   */
  public static getFormattedDate(date: string, format?: string): string {
    return moment(date)
      .locale('fr')
      .format(format);
  }

  /**
   * Gets the calculated date
   * @param type
   * @param delay
   * @param unit
   * @param format The expected format
   * @returns an ISO date by default
   */
  public static getDateWithDelay(type: 'add' | 'subtract', delay: number, unit: MomentUnit, format?: string): string {
    return moment()[type](delay, unit)
    .locale('fr')
    .format(format);
  }

  /**
   * Compares two dates
   * @param date1
   * @param date2
   * @param format
   * @param unit
   */
  public static compareDates(
    date1: string, date2: string, format: string, unit: MomentUnit,
  ): MomentDateComparedResult {
    const date1ToCompare = moment(moment(date1)
    .format(format));
    const date2ToCompare = moment(moment(date2)
    .format(format));

    if (date1ToCompare.isSame(date2ToCompare, unit)) {
      return 'isSame';
    } else if (date1ToCompare.isBefore(date2ToCompare, unit)) {
      return 'isBefore';
    } else if (date1ToCompare.isAfter(date2ToCompare, unit)) {
      return 'isAfter';
    } else {
      throw new Error('Not supposed to happen!')
    }
  }

  /**
   * Gets the time offset from a date
   * @param date
   * @param unit
   */
  public static getTimeOffsetFromDate(date: string, unit: MomentUnit): number {
    return moment().diff(date, unit);
  }
}
