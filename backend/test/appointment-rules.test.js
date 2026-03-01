const test = require('node:test');
const assert = require('node:assert/strict');
const { hasOverlap, canTransition, isWithinQuietHours } = require('../src/modules/appointments/domain/appointmentRules');

test('hasOverlap detecta solapamiento correctamente', () => {
  const startA = new Date('2026-03-01T10:00:00.000Z');
  const endA = new Date('2026-03-01T10:30:00.000Z');
  const startB = new Date('2026-03-01T10:20:00.000Z');
  const endB = new Date('2026-03-01T10:50:00.000Z');

  assert.equal(hasOverlap(startA, endA, startB, endB), true);
});

test('canTransition valida transición de estado permitida', () => {
  assert.equal(canTransition('PENDIENTE', 'CONFIRMADA'), true);
  assert.equal(canTransition('CONFIRMADA', 'COMPLETADA'), true);
  assert.equal(canTransition('COMPLETADA', 'PENDIENTE'), false);
});

test('isWithinQuietHours soporta rango nocturno cruzando medianoche', () => {
  const inside = new Date('2026-03-01T23:00:00');
  const outside = new Date('2026-03-01T15:00:00');

  assert.equal(isWithinQuietHours(inside, '22:00', '07:00'), true);
  assert.equal(isWithinQuietHours(outside, '22:00', '07:00'), false);
});
