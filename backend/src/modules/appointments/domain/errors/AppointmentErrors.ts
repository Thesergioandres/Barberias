export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class InvalidAppointmentStateError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAppointmentStateError';
  }
}

export class CancellationNotAllowedError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'CancellationNotAllowedError';
  }
}

export class OverlappingAppointmentError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'OverlappingAppointmentError';
  }
}
