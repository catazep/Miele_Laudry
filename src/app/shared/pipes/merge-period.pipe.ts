import { Pipe, PipeTransform } from '@angular/core';

import { formatDate, formatTime } from '../helpers/date-format.helpers';

export const ONGOING_TOKEN = 'Ongoing';

@Pipe({ name: 'mergePeriod', standalone: true })
export class MergePeriodPipe implements PipeTransform {
  public transform(startedAt: string, stoppedAt?: string, dateFormat = 'dd.MM'): string {
    const start = new Date(startedAt);
    const startDate = formatDate(start, dateFormat);
    const startTime = formatTime(start);

    if (!stoppedAt) {
      return `${startDate} (${startTime} - ${ONGOING_TOKEN})`;
    }

    const end = new Date(stoppedAt);
    const endTime = formatTime(end);

    if (start.toDateString() === end.toDateString()) {
      return `${startDate} (${startTime} - ${endTime})`;
    }

    return `${startDate} (${startTime}) - ${formatDate(end, dateFormat)} (${endTime})`;
  }
}
