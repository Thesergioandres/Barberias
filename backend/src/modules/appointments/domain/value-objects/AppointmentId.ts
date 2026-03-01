export class AppointmentId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('AppointmentId cannot be empty');
    }
  }

  toString() {
    return this.value;
  }
}
