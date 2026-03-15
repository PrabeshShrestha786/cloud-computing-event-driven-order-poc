# Sustainability Considerations

## Overview

Sustainability is an important aspect of modern cloud architecture. The grocery order processing system applies several design choices that reduce energy consumption and improve overall cloud efficiency.

## Serverless Architecture

The system is built primarily on serverless services such as:

- Azure Functions
- Azure Event Grid
- Azure Service Bus

Serverless platforms allocate compute resources only when workloads are executed. This reduces idle infrastructure and helps lower overall energy usage compared to always-on virtual machines.

## Efficient Resource Utilization

Using asynchronous messaging allows the system to process workloads only when required. Orders are buffered in the queue and processed by functions that scale automatically.

This design avoids unnecessary resource usage and allows compute resources to scale down when demand is low.

## Regional Deployment

The project uses the **Sweden Central** Azure region.

Choosing a region close to the intended user base reduces network latency and lowers the energy cost of data transmission.

In a production scenario, the system could be deployed in a Finnish Azure region once available to further reduce network distance.

## Monitoring and Optimization

Monitoring tools such as Azure Monitor and Application Insights allow the team to observe system activity and optimize resource usage.

Operational insights help identify inefficient processes or unnecessary resource consumption.

## Sustainability Value

By combining serverless architecture, efficient messaging patterns, and monitoring tools, the system demonstrates how modern cloud applications can be designed with sustainability considerations in mind while maintaining performance and scalability.