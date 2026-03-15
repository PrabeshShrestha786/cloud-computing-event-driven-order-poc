# System Architecture

## Overview

The grocery order processing system is designed as an event-driven cloud-native application on Microsoft Azure. The architecture separates order submission, asynchronous processing, event notification, and operational projections into independent components.

This design improves scalability, resilience, and maintainability while supporting the project goal of implementing a lightweight proof of concept for click-and-collect grocery order processing.

## High-Level Architecture

The implemented system flow is:

Order Submission API → Azure Service Bus Queue → Worker Azure Function → Cosmos DB (Orders) → Azure Event Grid → Projection Consumer Azure Function → Cosmos DB (Store Tasks)

Each component has a clearly defined responsibility and communicates through events or durable messaging.

## Main Components

### Order Submission API

The `submitOrder` Azure Function provides the entry point for client requests. It validates incoming JSON payloads and submits valid orders to Azure Service Bus.

### Azure Service Bus

Azure Service Bus decouples the API from backend processing. It absorbs bursts of incoming traffic and allows orders to be processed asynchronously.

### Worker Function

The `processOrder` Azure Function is triggered by messages in the queue. It stores the processed order in Cosmos DB and publishes an `OrderProcessed` event to Azure Event Grid.

### Cosmos DB Orders Container

The `orders` container stores accepted order documents. Each document includes identifiers, customer details, items, status, and processing timestamps.

### Azure Event Grid

Azure Event Grid distributes order processed notifications to downstream consumers using a publish-subscribe pattern.

### Projection Consumer

The `storeTaskBoardWebhook` Azure Function receives `OrderProcessed` events and updates the `storeTasks` projection container.

### Cosmos DB Store Tasks Container

The `storeTasks` container stores operational projection data used by store applications to identify orders that are ready for picking.

## Architectural Characteristics

The architecture demonstrates the following cloud design characteristics:

- asynchronous communication
- loose coupling between services
- serverless execution
- scalable document storage
- event-driven notification
- projection-based read model for store operations

## Alignment with Project Goals

This architecture matches the project objective of building a lightweight Azure-based proof of concept while also supporting the strategy-focused aspects of the assignment such as observability, SRE, governance, and FinOps.

The design is intentionally modular so that additional consumers, dashboards, or operational workflows can be added later without redesigning the full pipeline.