export class TimeRange {
  constructor(
    private readonly startAt: Date,
    private readonly endAt: Date
  ) {
    if (endAt.getTime() <= startAt.getTime()) {
      throw new Error('TimeRange end must be after start');
    }
  }

  getStartAt() {
    return new Date(this.startAt);
  }

  getEndAt() {
    return new Date(this.endAt);
  }

  overlapsWith(other: TimeRange) {
    return (
      this.startAt.getTime() < other.endAt.getTime() &&
      other.startAt.getTime() < this.endAt.getTime()
    );
  }

  minutesUntilStart(from: Date) {
    const diffMs = this.startAt.getTime() - from.getTime();
    return Math.floor(diffMs / 60000);
  }
}
