import { MergePeriodPipe, ONGOING_TOKEN } from './merge-period.pipe';

describe('MergePeriodPipe', () => {
  let pipe: MergePeriodPipe;

  beforeEach(() => {
    pipe = new MergePeriodPipe();
  });

  it('should format same-day period on a single line', () => {
    const result = pipe.transform('2024-03-15T10:00:00', '2024-03-15T12:30:00', 'dd.MM');
    expect(result).toBe('15.03 (10:00 - 12:30)');
  });

  it('should show Ongoing when end date is missing', () => {
    const result = pipe.transform('2024-03-15T10:00:00', undefined, 'dd.MM');
    expect(result).toBe(`15.03 (10:00 - ${ONGOING_TOKEN})`);
  });

  it('should format different-day period with start and end dates', () => {
    const result = pipe.transform('2024-03-15T10:00:00', '2024-03-20T14:45:00', 'dd.MM');
    expect(result).toBe('15.03 (10:00) - 20.03 (14:45)');
  });

  it('should format different-year period showing full year in both dates', () => {
    const result = pipe.transform('2023-12-31T23:00:00', '2024-01-01T01:00:00', 'dd.MM.yyyy');
    expect(result).toBe('31.12.2023 (23:00) - 01.01.2024 (01:00)');
  });
});
