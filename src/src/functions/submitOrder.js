const { app } = require('@azure/functions');
const { ServiceBusClient } = require("@azure/service-bus");

const connectionString = process.env.ServiceBusConnection;
const queueName = "orders-queue";

app.http('submitOrder', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    let order;

    try {
      order = await request.json();
    } catch (error) {
      return {
        status: 400,
        jsonBody: {
          error: "Invalid JSON body"
        }
      };
    }

    const orderId = order?.orderId;
    const customer = order?.customer;
    const items = order?.items;

    const errors = [];

    if (!orderId || String(orderId).trim() === "") {
      errors.push("orderId is required");
    }

    if (!customer || String(customer).trim() === "") {
      errors.push("customer is required");
    }

    if (!Array.isArray(items) || items.length === 0) {
      errors.push("items is required and must be a non-empty array");
    }

    if (errors.length > 0) {
      return {
        status: 400,
        jsonBody: {
          error: "Validation failed",
          details: errors
        }
      };
    }

    let sbClient;
    let sender;

    try {
      sbClient = new ServiceBusClient(connectionString);
      sender = sbClient.createSender(queueName);

      await sender.sendMessages({
        body: order
      });

      return {
        status: 200,
        jsonBody: {
          message: "Order submitted successfully",
          order: order
        }
      };
    } catch (error) {
      context.log("Failed to submit order:", error?.message || error);

      return {
        status: 500,
        jsonBody: {
          error: "Failed to submit order"
        }
      };
    } finally {
      if (sender) {
        await sender.close();
      }
      if (sbClient) {
        await sbClient.close();
      }
    }
  }
});