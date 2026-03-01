# API Reference

Base URL: /api

## Auth

- POST /auth/login
  - body: { email, password }
  - returns: { token, user }

- GET /auth/me
  - auth: Bearer token

- POST /auth/password/forgot
  - body: { email }
  - returns: { message, resetToken } (resetToken is for dev/demo)

- POST /auth/password/reset
  - body: { token, password }

## Users

- GET /users
  - auth: ADMIN
  - query: role? (ADMIN|BARBER|CLIENT)

- POST /users/register
  - public
  - body: { name, email, phone(+E.164), password, whatsappConsent }

- POST /users/admin
  - auth: ADMIN
  - body: { name, email, phone(+E.164), password, role }

- GET /users/pending
  - auth: GOD

- PATCH /users/:id/approve
  - auth: GOD

- PATCH /users/:id
  - auth: ADMIN
  - body: { name?, email?, phone?, role?, active?, whatsappConsent?, password? }

- PATCH /users/:id/whatsapp-consent
  - auth: owner or ADMIN
  - body: { whatsappConsent }

- PATCH /users/me
  - auth: owner
  - body: { name?, phone?, whatsappConsent? }

- GET /users/public/barbers
  - public

## Services

- GET /services
  - query: onlyActive=true|false

- POST /services
  - auth: ADMIN
  - body: { name, description?, durationMinutes, price, active? }

- PATCH /services/:id
  - auth: ADMIN
  - body: { name?, description?, durationMinutes?, price?, active? }

## Barbers

- GET /barbers/:barberId/schedules
  - auth: ADMIN|BARBER|CLIENT

- POST /barbers/:barberId/schedules
  - auth: ADMIN|BARBER
  - body: { dayOfWeek, startTime, endTime }

- GET /barbers/:barberId/blocks
  - auth: ADMIN|BARBER

- POST /barbers/:barberId/blocks
  - auth: ADMIN|BARBER
  - body: { startAt, endAt, reason? }

## Appointments

- GET /appointments
  - auth: ADMIN|BARBER|CLIENT
  - query: clientId?, barberId?, startFrom?, startTo?

- POST /appointments
  - auth: ADMIN|CLIENT
  - body: { clientId?, barberId, serviceId, startAt, notes? }

- PATCH /appointments/:id/status
  - auth: ADMIN|BARBER
  - body: { nextStatus }

- POST /appointments/:id/cancel
  - auth: ADMIN|CLIENT

- POST /appointments/:id/reschedule
  - auth: ADMIN|CLIENT
  - body: { startAt }

- POST /appointments/:id/reassign
  - auth: ADMIN
  - body: { newBarberId }

- GET /appointments/:id/history
  - auth: ADMIN|BARBER|CLIENT

## Notifications

- GET /notifications/logs
  - auth: ADMIN

- GET /notifications/config
  - auth: ADMIN

- PATCH /notifications/config
  - auth: ADMIN
  - body: {
      minAdvanceMinutes?,
      cancelLimitMinutes?,
      rescheduleLimitMinutes?,
      quietHoursStart?,
      quietHoursEnd?,
      reminderMinutes?,
      whatsappEnabledEvents?,
      whatsappTemplates?,
      whatsappDebounceSeconds?
    }

## Reports

- GET /reports/summary
  - auth: ADMIN
