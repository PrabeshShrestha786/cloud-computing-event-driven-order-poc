# ADR-003: Use Azure Event Grid for Order Notifications

## Status
Accepted

## Context

After an order is processed and stored in the database, downstream systems such as store applications need to be notified that the order is ready for preparation.

Direct communication between services would tightly couple system components and reduce flexibility. A publish–subscribe event distribution mechanism is needed to notify multiple consumers when an order has been processed.

## Options Considered

1. Direct HTTP calls from the worker function
2. Azure Service Bus topics
3. Azure Event Grid

## Decision

Azure Event Grid was selected as the event notification system.

After an order is successfully processed and stored in Cosmos DB, the worker function publishes an `OrderProcessed` event to an Event Grid topic.

Event Grid then delivers this event to the projection consumer Azure Function.

## Rationale

Azure Event Grid is designed specifically for event notification scenarios and provides the following advantages:

- Native integration with Azure services
- Scalable event delivery
- Event filtering and routing capabilities
- Reliable webhook delivery

Using Event Grid allows additional services to subscribe to order events without modifying the core order processing system.

## Implications

Positive:

- Loose coupling between services
- Easy addition of new event consumers
- Reliable event distribution

Negative:

- Additional infrastructure component
- Slightly increased complexity in event management