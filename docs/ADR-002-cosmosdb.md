# ADR-002: Use Azure Cosmos DB for Order Storage

## Status
Accepted

## Context

The order processing system requires a database capable of handling high write throughput and scalable data storage. Orders must be stored reliably and accessed by downstream services such as the store task board projection.

The system also needs a globally distributed database that integrates well with Azure serverless components.

## Options Considered

1. Azure SQL Database
2. Azure Cosmos DB
3. Azure Table Storage

## Decision

Azure Cosmos DB was selected as the primary database for storing order data and projection data.

The system uses two containers:

- `orders` container for storing processed orders
- `storeTasks` container for storing projection data used by the store task board

## Rationale

Azure Cosmos DB provides several advantages for this system:

- Low latency data access
- High scalability for read and write operations
- Native integration with Azure Functions
- Flexible schema support for JSON documents
- Partitioning support for distributing workload

Using Cosmos DB also aligns well with the event-driven architecture where documents are written asynchronously after queue processing.

## Implications

Positive:

- High scalability for order processing workloads
- Flexible document structure for evolving data models
- Serverless pricing suitable for low-to-medium workloads

Negative:

- Higher cost compared to simple storage solutions if not optimized
- Requires careful partition key selection to ensure performance