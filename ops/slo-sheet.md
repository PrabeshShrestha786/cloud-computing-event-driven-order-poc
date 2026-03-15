# SLO Sheet

## Service

Event-Driven Grocery Order Processing System

## Critical User Journey

Customer submits a grocery order through the API, the order is processed asynchronously, stored in Cosmos DB, and projected to the store task board.

## Service Level Objectives (SLOs)

| SLO | Target |
|---|---|
| API availability | 99.9% monthly |
| Order submission latency | p95 ≤ 500 ms |
| End-to-end order processing latency | p95 ≤ 2 seconds |
| Queue backlog | Less than 100 active messages during normal operation |
| Function error rate | Less than 1% |

## Service Level Indicators (SLIs)

The following indicators are used to measure the SLOs:

- HTTP request success rate from Application Insights
- HTTP request duration from Application Insights
- Function execution failures from Azure Monitor
- Service Bus active message count
- Event Grid delivery metrics
- Cosmos DB request activity and response times

## Error Budget

For an availability target of 99.9% per month, the allowed downtime is approximately 43 minutes per month.

If the error budget is consumed too quickly, feature changes should be slowed and reliability improvements prioritized.

## Alerting and On-Call

The following alert conditions are recommended:

- API failure rate exceeds threshold
- Function execution errors increase
- Queue depth remains elevated for an extended period
- Event Grid delivery failures occur

## Dashboards

The SLOs are supported by dashboards and metrics from:

- Azure Application Insights
- Azure Monitor
- Azure Service Bus metrics
- Azure Event Grid metrics
- Azure Cosmos DB metrics