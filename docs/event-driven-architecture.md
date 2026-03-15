# Event-Driven Architecture

## Overview

The grocery order system follows an event-driven architecture where system components communicate through asynchronous events instead of direct synchronous calls. This design improves scalability, reliability, and decoupling between services.

The system processes grocery orders submitted by customers and distributes the processing tasks across multiple cloud services using Azure messaging and serverless components.

## Architecture Workflow

The implemented workflow is:

Order Submission API → Azure Service Bus Queue → Worker Azure Function → Cosmos DB (Orders) → Event Grid → Projection Consumer → Cosmos DB (Store Tasks)

This workflow allows each component to operate independently while maintaining a reliable order processing pipeline.

## Component Description

### Order Submission API

The order submission API is implemented as an Azure Function with an HTTP trigger. It receives order requests from clients and validates the input fields before forwarding the order to the messaging system.

Required fields include:

- orderId
- customer
- items

Once validated, the order message is sent to the Azure Service Bus queue.

### Azure Service Bus Queue

Azure Service Bus acts as the messaging backbone of the system. It ensures reliable message delivery and decouples the API layer from the backend processing logic.

Benefits of using Service Bus include:

- asynchronous processing
- retry mechanisms
- message durability
- dead-letter queue support

Orders submitted by the API are placed into the `orders-queue` queue for processing.

### Worker Azure Function

The worker Azure Function is triggered automatically when a message arrives in the Service Bus queue. Its responsibilities include:

- reading the order message
- validating the order structure
- storing the order document in Cosmos DB
- publishing an event to Event Grid after successful processing

This function ensures that order processing occurs independently from the API layer.

### Cosmos DB (Orders Container)

The processed order is stored in Azure Cosmos DB within the `orders` container. Each order document includes fields such as:

- id
- orderId
- customer
- items
- status
- processedAt

The partition key used is `/orderId`, ensuring efficient distribution and scalability.

### Event Grid

After the order is stored in Cosmos DB, the worker function publishes an `OrderProcessed` event to Azure Event Grid.

Event Grid enables downstream services to react to order processing events without tightly coupling them to the worker function.

### Projection Consumer

The projection consumer is implemented as another Azure Function that receives Event Grid notifications through a webhook endpoint.

This function listens for `OrderProcessed` events and updates the store task board projection.

### Cosmos DB (Store Tasks Container)

The projection consumer writes documents to the `storeTasks` container in Cosmos DB.

These documents represent operational tasks for store workers preparing customer orders.

Example projection fields include:

- orderId
- storeId
- taskState
- status
- processedAt
- updatedAt

The partition key used is `/storeId`.

## Benefits of Event-Driven Architecture

The event-driven design provides several advantages:

- loose coupling between services
- improved scalability through asynchronous processing
- resilience through message retries and durable queues
- easier integration with additional downstream services

This architecture allows the system to evolve by adding new event consumers without modifying the core order processing pipeline.