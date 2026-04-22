import { MergePeriodPipe, ONGOING_TOKEN } from './merge-period.pipe';

describe('MergePeriodPipe', () => {
  let pipe: MergePeriodPipe;

  beforeEach(() => {
    pipe = new MergePeriodPipe();
  });

  it('should format same-day period without year', () => {
    const result = pipe.transform('2024-03-15T10:00:00', '2024-03-15T12:30:00');
    expect(result).toBe('15.03 (10:00 - 12:30)');
  });

  it('should show Ongoing without year when end date is missing', () => {
    const result = pipe.transform('2024-03-15T10:00:00', undefined);
    expect(result).toBe(`15.03 (10:00 - ${ONGOING_TOKEN})`);
  });

  it('should format different-day same-year period without year', () => {
    const result = pipe.transform('2024-03-15T10:00:00', '2024-03-20T14:45:00');
    expect(result).toBe('15.03 (10:00) - 20.03 (14:45)');
  });

  it('should format different-year period with full year on both dates', () => {
    const result = pipe.transform('2023-12-31T23:00:00', '2024-01-01T01:00:00');
    expect(result).toBe('31.12.2023 (23:00) - 01.01.2024 (01:00)');
  });

  it('should format different-year period with full year on both dates, taking into account the format', () => {
    const result = pipe.transform('2023-12-31T23:00:00', '2024-01-01T01:00:00', 'yy-dd-MM');
    expect(result).toBe('23-31-12 (23:00) - 24-01-01 (01:00)');
  });
});
