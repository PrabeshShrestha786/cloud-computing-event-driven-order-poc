# SRE Pack

## Overview

Site Reliability Engineering (SRE) practices are applied to define measurable reliability targets for the grocery order processing system and to support operational readiness.

The system uses monitoring, alerts, and documented operational procedures to maintain reliability during normal operation and under load.

## Reliability Goals

The main reliability goals of the system are:

- maintain high API availability
- process orders within acceptable latency
- prevent queue buildup from becoming prolonged
- detect failures quickly through monitoring and alerts

## Key SLIs

The following Service Level Indicators (SLIs) are relevant to the system:

- request success rate
- request latency
- function execution failure rate
- queue depth
- event delivery success
- database responsiveness

## SLO Policy

The project defines the following targets:

- availability: 99.9% monthly
- end-to-end processing latency: p95 ≤ 2 seconds
- API latency: p95 ≤ 500 ms
- function error rate: less than 1%

If these targets are not met, corrective action should be taken before adding further system complexity.

## Incident Runbooks

### Runbook 1 – Queue Backlog Growth

Symptoms:

- active messages remain high in Service Bus
- processing latency increases

Actions:

1. Check Function App health and execution logs
2. Verify whether the worker function is processing messages
3. Inspect dead-letter queue status
4. Check Cosmos DB or downstream dependency issues
5. Scale investigation and reprocess failed messages if needed

### Runbook 2 – Function Failure Spike

Symptoms:

- increased failed executions in Application Insights
- API or worker errors visible in logs

Actions:

1. Review Application Insights exception logs
2. Check configuration values and recent deployments
3. Verify connection settings for Service Bus, Cosmos DB, and Event Grid
4. Roll back recent changes if necessary
5. Retest the pipeline using a known valid request

### Runbook 3 – Event Grid Delivery Issue

Symptoms:

- orders stored successfully but projection not updated
- missing store task documents

Actions:

1. Confirm Event Grid topic health
2. Check whether the subscription webhook is reachable
3. Review logs for `storeTaskBoardWebhook`
4. Inspect failed event delivery metrics
5. Replay or manually retest event delivery if necessary

## Monitoring Strategy

The monitoring approach combines Azure-native services:

- Application Insights for request and exception monitoring
- Azure Monitor for metrics and alerting
- Service Bus metrics for queue visibility
- Event Grid metrics for event delivery tracking
- Cosmos DB metrics for request behavior and performance

## Operational Readiness

Although the project is a lightweight proof of concept, the system design supports operational maturity through clear SLOs, alert conditions, and incident handling practices.