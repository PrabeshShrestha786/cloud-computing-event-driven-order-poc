const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");
const { EventGridPublisherClient, AzureKeyCredential } = require("@azure/eventgrid");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

const egEndpoint = process.env.EVENTGRID_TOPIC_ENDPOINT;
const egKey = process.env.EVENTGRID_TOPIC_KEY;

const databaseId = "grocery-orders";
const containerId = "orders";

app.serviceBusQueue('processOrder', {
  connection: 'ServiceBusConnection',
  queueName: 'orders-queue',
  handler: async (message, context) => {
    const incoming = message?.body ?? message ?? {};
    const orderId = incoming.orderId || incoming.id;

    if (!orderId) {
      context.log("Invalid order: missing orderId", incoming);
      return;
    }

    const client = new CosmosClient({ endpoint, key });
    const container = client.database(databaseId).container(containerId);

    const normalizedOrderId = String(orderId);

    // Idempotency check
    try {
      const { resource: existingOrder } = await container.item(normalizedOrderId, normalizedOrderId).read();

      if (existingOrder) {
        context.log(`Duplicate order detected, skipping processing: ${normalizedOrderId}`);
        return;
      }
    } catch (error) {
      if (error.code !== 404) {
        context.log("Error checking existing order:", error.message || error);
        throw error;
      }
    }

    const orderDoc = {
      ...incoming,
      id: normalizedOrderId,
      orderId: normalizedOrderId,
      status: incoming.status || "accepted",
      processedAt: new Date().toISOString()
    };

    await container.items.create(orderDoc);

    const storeId = incoming.storeId || "store-001";

    if (egEndpoint && egKey) {
      const egClient = new EventGridPublisherClient(
        egEndpoint,
        "EventGrid",
        new AzureKeyCredential(egKey)
      );

      const event = {
        subject: `/orders/${orderDoc.orderId}`,
        eventType: "OrderProcessed",
        dataVersion: "1.0",
        data: {
          orderId: orderDoc.orderId,
          status: orderDoc.status,
          processedAt: orderDoc.processedAt,
          storeId: storeId
        }
      };

      await egClient.send([event]);
      context.log("EventGrid event published:", event.eventType, event.subject);
    } else {
      context.log("EventGrid not configured (missing EVENTGRID_TOPIC_ENDPOINT / EVENTGRID_TOPIC_KEY)");
    }

    context.log("Order saved to Cosmos DB:", orderDoc);
  }
});