# API Design

## Overview

The grocery order system exposes a minimal HTTP API for order submission. The API is implemented using an Azure Function named `submitOrder`.

The endpoint accepts customer grocery orders and forwards valid requests to Azure Service Bus for asynchronous processing.

## Endpoint

**Method:** POST  
**Path:** `/api/submitorder`

## Purpose

The purpose of the API is to receive grocery orders from clients and place them into the event-driven processing pipeline.

The API does not process orders directly. Instead, it validates the request and submits the message to Azure Service Bus.

## Request Format

A valid request body must be in JSON format and include the following fields:

- `orderId`
- `customer`
- `items`

Example request:

```json
{
  "orderId": "order-1001",
  "customer": "Prabesh Shrestha",
  "items": [
    { "name": "Milk", "qty": 2 },
    { "name": "Bread", "qty": 1 }
  ],
  "storeId": "store-001"
}