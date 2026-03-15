# API Validation

## Overview

Input validation is implemented in the `submitOrder` Azure Function to ensure that only valid requests enter the order processing pipeline.

Validation is important in an event-driven architecture because invalid messages could propagate through the messaging system and cause failures in downstream services.

## Validation Rules

The API validates the following fields before submitting an order to Azure Service Bus:

| Field | Requirement |
|------|-------------|
| orderId | Must be present and non-empty |
| customer | Must be present and non-empty |
| items | Must be a non-empty array |

If any required field is missing, the API returns an HTTP 400 response.

## Invalid JSON Handling

If the request body cannot be parsed as JSON, the function returns:

HTTP 400 – Invalid JSON body

This prevents malformed requests from entering the system.

## Example Validation Failure

Example invalid request:

```json
{
  "customer": "Prabesh Shrestha",
  "items": [
    { "name": "Milk", "qty": 2 }
  ]
}