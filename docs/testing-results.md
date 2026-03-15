# Testing Results

## Overview

Testing was performed to verify that the order submission API and the event-driven processing pipeline behave correctly under normal and repeated request conditions.

Two types of tests were used:

- smoke tests
- burst tests

## Smoke Tests

Smoke tests were used to confirm that the main API behavior worked as expected.

The following scenarios were tested:

1. valid order submission
2. invalid request with missing required field
3. duplicate order submission

### Smoke Test Results

| Test Case | Expected Result | Observed Result |
|---|---|---|
| Valid order | HTTP 200 | Passed |
| Missing `orderId` | HTTP 400 | Observed during validation check |
| Duplicate order | Accepted at API, handled safely downstream | Passed |

The smoke tests confirmed that the API endpoint was reachable and that valid orders entered the processing pipeline successfully.

## Burst Tests

Burst tests were used to observe system behavior when multiple requests were submitted in a short period of time.

These tests helped verify that:

- the API remained responsive
- Azure Service Bus buffered the incoming requests
- the worker function processed queued messages asynchronously
- the queue drained successfully after processing

### Burst Test Observation

During burst testing, the system remained stable and continued processing requests without dead-letter failures.

The queue temporarily absorbed the request spike and returned to zero active messages after the worker completed processing.

## Conclusion

The testing results demonstrate that the system supports both normal order submission and short bursts of repeated requests.

The combination of API validation, asynchronous queue processing, and serverless execution improved the reliability of the overall event-driven workflow.