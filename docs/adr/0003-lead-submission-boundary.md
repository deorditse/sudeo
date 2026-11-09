# ADR-0003: Keep lead delivery behind a configurable server contract

- **Status:** Accepted
- **OpenSpec change:** `launch-sudeo-company-site`

## Context

A static browser bundle cannot protect CRM credentials or honestly provide durable queueing, retries, notifications, retention, and deletion. No production lead service has been selected.

## Decision

Implement accessible client validation and submit only to a configurable HTTPS endpoint. Send an idempotency key and privacy-safe source metadata. Show success only after the endpoint confirms acceptance. Disable online delivery truthfully when the endpoint is absent.

The future server contract must provide server validation, rate limiting, spam controls, idempotency, durable storage/queueing, CRM retries, minimal notifications, retention, deletion, and monitored failure handling.

## Alternatives

- Direct browser-to-CRM credentials: rejected because secrets would be exposed.
- `mailto:` submission: rejected because it is unreliable and cannot meet acceptance requirements.
- Simulated local success: rejected because it would falsely claim that an enquiry was saved.

## Consequences

The static launch can demonstrate and validate the form but production lead acceptance remains blocked until a server integration is selected and tested.
