const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

const databaseId = "grocery-orders";
const containerId = "storeTasks";

app.http("storeTaskBoardWebhook", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    // Event Grid delivers an array of events
    let events;
    try {
      events = await request.json();
    } catch (e) {
      context.log("Invalid JSON body:", e?.message);
      return { status: 400, jsonBody: { error: "Invalid JSON" } };
    }

    if (!Array.isArray(events)) {
      return { status: 400, jsonBody: { error: "Expected an array of Event Grid events" } };
    }

    // Handle Event Grid subscription validation handshake
    const validationEvent = events.find(
      (e) => e?.eventType === "Microsoft.EventGrid.SubscriptionValidationEvent"
    );

    if (validationEvent) {
      const validationCode = validationEvent?.data?.validationCode;
      context.log("Event Grid subscription validation received:", validationCode);

      return {
        status: 200,
        jsonBody: {
          validationResponse: validationCode
        }
      };
    }

    // Normal event processing: write projection to Cosmos (storeTasks)
    if (!endpoint || !key) {
      context.log("Missing COSMOS_ENDPOINT / COSMOS_KEY");
      return { status: 500, jsonBody: { error: "Cosmos not configured" } };
    }

    const client = new CosmosClient({ endpoint, key });
    const container = client.database(databaseId).container(containerId);

    let processed = 0;

    for (const ev of events) {
      // We publish eventType: "OrderProcessed"
      if (ev?.eventType !== "OrderProcessed") continue;

      const data = ev?.data || {};
      const orderId = data.orderId;
      const storeId = data.storeId || "store-001";

      if (!orderId) {
        context.log("Skipping event: missing orderId", ev);
        continue;
      }

      // Projection document for "store task board"
      const taskDoc = {
        id: String(orderId),
        orderId: String(orderId),
        storeId: String(storeId),
        eventType: ev.eventType,
        status: data.status || "accepted",
        taskState: "READY_FOR_PICKING",
        processedAt: data.processedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await container.items.upsert(taskDoc);
      processed++;

      context.log("Projection updated in storeTasks:", taskDoc.id);
    }

    return {
      status: 200,
      jsonBody: { ok: true, processed }
    };
  }
});