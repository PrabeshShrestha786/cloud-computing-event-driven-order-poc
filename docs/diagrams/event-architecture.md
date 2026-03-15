# Event-Driven Architecture Diagram

```mermaid
flowchart TD

Client[Client / API Request]

API[submitOrder Function<br>HTTP Trigger]

SB[Azure Service Bus<br>orders-queue]

Worker[processOrder Function]

CosmosOrders[(Cosmos DB<br>orders container)]

EventGrid[Azure Event Grid<br>OrderProcessed Event]

Projection[storeTaskBoardWebhook Function]

CosmosTasks[(Cosmos DB<br>storeTasks container)]

Client --> API
API --> SB
SB --> Worker
Worker --> CosmosOrders
Worker --> EventGrid
EventGrid --> Projection
Projection --> CosmosTasks