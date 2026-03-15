# ADR-001: Use Azure Service Bus for Order Messaging

## Status
Accepted

## Context

The grocery order system requires a reliable way to process customer orders asynchronously.  
Direct synchronous processing between services would tightly couple the API layer with backend processing and could cause failures during high load or temporary service outages.

A messaging solution is required to decouple order submission from order processing.

## Options Considered

1. Direct HTTP processing between services
2. Azure Service Bus Queue
3. Azure Event Hub

## Decision

Azure Service Bus Queue was selected as the messaging backbone of the system.

Orders submitted through the API are placed into the `orders-queue`, where they are processed asynchronously by the worker Azure Function.

## Rationale

Azure Service Bus provides several benefits:

- Reliable message delivery
- Built-in retry mechanisms
- Dead-letter queue support
- Asynchronous processing
- Decoupling between API and backend services

These features improve system resilience and allow the order processing pipeline to scale independently from the API layer.

## Implications

Positive:

- Increased system reliability
- Loose coupling between services
- Ability to handle burst traffic using queue buffering

Negative:

- Slight increase in processing latency due to asynchronous workflow
- Additional infrastructure component to manage