const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

const databaseId = "grocery-orders";
const containerId = "orders";

app.serviceBusQueue('processOrder', {
  connection: 'ServiceBusConnection',
  queueName: 'orders-queue',
  handler: async (message, context) => {

    // message.body is what we sent from submitOrder
    const incoming = message || {};

    // Ensure required fields exist
    const orderId = incoming.orderId || incoming.id;
    if (!orderId) {
      context.log("Invalid order: missing orderId", incoming);
      return;
    }

    // Cosmos requires "id". Our partition key is "/orderId"
    const orderDoc = {
      ...incoming,
      id: String(orderId),
      orderId: String(orderId),
      status: incoming.status || "accepted",
      processedAt: new Date().toISOString()
    };

    const client = new CosmosClient({ endpoint, key });
    const container = client.database(databaseId).container(containerId);

    await container.items.create(orderDoc);

    context.log("Order saved to Cosmos DB:", orderDoc);
  }
});