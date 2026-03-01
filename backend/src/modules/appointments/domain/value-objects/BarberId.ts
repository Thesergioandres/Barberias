export class BarberId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('BarberId cannot be empty');
    }
  }

  toString() {
    return this.value;
  }
}
