# FinOps Cost Analysis

## Overview

Cloud Financial Operations (FinOps) practices were applied to estimate the operational cost of the grocery order processing system and identify opportunities for cost optimization.

The system was intentionally designed using serverless Azure services to minimize idle resource costs.

## Cost Model

The proof-of-concept architecture uses the following Azure services:

- Azure Functions (Consumption Plan)
- Azure Service Bus (Basic Tier)
- Azure Cosmos DB
- Azure Storage Account
- Azure Event Grid
- Azure Application Insights

These services scale automatically and charge based on usage.

## Estimated Monthly Cost

For a small proof-of-concept workload, the approximate monthly cost is estimated as:

| Service | Estimated Cost |
|---|---|
| Azure Functions | €0.50 |
| Azure Service Bus | €0.60 |
| Cosmos DB | €1.20 |
| Storage Account | €0.10 |
| Event Grid | €0.10 |

Estimated total:

€2–3 per month under light usage.

## Unit Economics

A useful FinOps metric is cost per processed order.

Example estimate:

If the system processes 1000 orders per month:

Total cost ≈ €2.40

Cost per order:

€2.40 / 1000 ≈ €0.0024 per order

This demonstrates the cost efficiency of a serverless event-driven architecture.

## Cost Optimization Strategies

Several cost optimization strategies were applied:

- serverless compute using Azure Functions consumption plan
- event-driven messaging to reduce idle processing
- Cosmos DB serverless usage
- lightweight telemetry collection

Application Insights sampling can also reduce monitoring costs by limiting telemetry volume.

## Budget and Cost Control

A recommended practice is to configure Azure budgets and alerts for the project subscription.

Example budget configuration:

- monthly budget threshold
- cost alerts at 50%, 75%, and 90% of the budget

This allows the team to detect cost anomalies early.

## FinOps Value

Applying FinOps practices ensures that cloud resources remain cost-effective while maintaining system reliability.

The architecture demonstrates how event-driven serverless systems can support scalable order processing while maintaining very low operational costs.