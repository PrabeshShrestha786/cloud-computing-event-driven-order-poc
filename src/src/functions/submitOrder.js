const { app } = require('@azure/functions');
const { ServiceBusClient } = require("@azure/service-bus");

const connectionString = process.env.ServiceBusConnection;
const queueName = "orders-queue";

app.http('submitOrder', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        const order = await request.json();

        const sbClient = new ServiceBusClient(connectionString);
        const sender = sbClient.createSender(queueName);

        await sender.sendMessages({
            body: order
        });

        await sender.close();
        await sbClient.close();

        return {
            status: 200,
            jsonBody: {
                message: "Order submitted successfully",
                order: order
            }
        };
    }
});