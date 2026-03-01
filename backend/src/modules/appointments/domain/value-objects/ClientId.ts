export class ClientId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ClientId cannot be empty');
    }
  }

  toString() {
    return this.value;
  }
}
