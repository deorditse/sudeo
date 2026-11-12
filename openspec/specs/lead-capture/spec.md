# lead-capture Specification

## Purpose
Defines reliable and privacy-conscious project enquiry behavior while keeping the static website honest about whether a server or CRM has actually accepted an enquiry.

## Requirements

### Requirement: Minimum enquiry fields
The primary enquiry form SHALL request a name, exactly one contact channel/value, a service selection, and a task description. It MUST NOT require both a phone number and an email address and MUST NOT upload files in the first version.

#### Scenario: Visitor completes the minimum form
- **WHEN** a visitor provides a name, one usable contact, a service, and a task description
- **THEN** the form is eligible for submission without requesting a second contact channel

### Requirement: Accessible validation and input preservation
The form SHALL validate required values before submission, associate errors with their fields, announce submission-level status to assistive technology, and preserve entered values when validation or delivery fails.

#### Scenario: Required value is missing
- **WHEN** a visitor submits an incomplete form
- **THEN** submission is blocked, focus moves to or identifies the first invalid field, and understandable field-level errors are presented without clearing valid input

#### Scenario: Delivery fails
- **WHEN** the configured endpoint returns an error or cannot be reached
- **THEN** the form displays a non-success error state and retains all entered values for retry or alternative contact

### Requirement: Confirmed success only
The site SHALL show a successful-submission state only after the configured lead endpoint confirms durable acceptance. When no endpoint is configured, the form MUST identify itself as unavailable or demonstration-only and MUST NOT claim that an enquiry was saved or sent to CRM.

#### Scenario: Endpoint confirms acceptance
- **WHEN** the endpoint returns the documented success response for a new enquiry
- **THEN** the site records one success event, prevents accidental immediate resubmission, and presents the success route or message

#### Scenario: Endpoint is not configured
- **WHEN** a visitor attempts to submit on a deployment without a configured lead endpoint
- **THEN** the site explains that online delivery is unavailable and offers only configured verified contact alternatives

### Requirement: Duplicate and abuse controls
The client SHALL prevent repeated submissions from rapid repeated activation while a request is pending and SHALL attach a per-attempt idempotency identifier. The server integration contract SHALL require server validation, rate limiting, spam protection, and idempotent handling before production enablement.

#### Scenario: Visitor double-clicks submit
- **WHEN** a valid request is already pending and the visitor activates submit again
- **THEN** no second client request is created and the pending state remains visible

### Requirement: Source metadata and privacy
A submitted enquiry SHALL include the originating page, selected service, timestamp, idempotency identifier, and available campaign source tags even when UTM tags are absent. Personal contact values and task text MUST NOT be placed in URLs, analytics payloads, or public/client diagnostic logs.

#### Scenario: Visitor arrives without campaign tags
- **WHEN** a valid enquiry is submitted without UTM parameters
- **THEN** the request remains valid and includes empty or absent campaign fields plus its origin page and service

#### Scenario: Analytics records form behavior
- **WHEN** form start, success, or failure is measured
- **THEN** the event contains no enquiry body, direct contact identifier, or other submitted personal data

### Requirement: Production integration boundary
Production submission SHALL use HTTPS and a documented configurable endpoint. CRM queueing, retry delivery, notification routing, retention, and deletion MUST be implemented and acceptance-tested in the server system before those capabilities are represented as available.

#### Scenario: Static site is deployed before backend selection
- **WHEN** the site is published without approved CRM and server infrastructure
- **THEN** documentation and UI identify the missing integration and do not simulate queueing, notifications, or CRM delivery
