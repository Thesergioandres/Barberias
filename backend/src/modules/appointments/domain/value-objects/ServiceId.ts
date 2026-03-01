export class ServiceId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ServiceId cannot be empty');
    }
  }

  toString() {
    return this.value;
  }
}
