You’re right 👍 — thanks for catching that. The **producer.py was from the earlier Event Hub exercise**, not this project. Your current project uses **HTTP + Azure Function**, not a Python producer.

Your actual flow is this:

```
Client (HTTP request)
        ↓
submitOrder Azure Function (HTTP Trigger)
        ↓
Service Bus Queue
        ↓
processOrder Azure Function (Queue Trigger)
        ↓
Cosmos DB
```

So here is the **correct short workflow to run your project again**.

---

# 🚀 Run the Project Again (Correct Steps)

## 1️⃣ Recreate Azure infrastructure

From the **infra folder**:

```bash
cd infra
terraform init
terraform apply
```

Type:

```
yes
```

This recreates:

* Resource Group
* Storage Account
* Function App
* Service Bus Namespace
* Service Bus Queue
* Cosmos DB
* Cosmos DB container
* Application Insights
* Log Analytics

---

## 2️⃣ Go to the functions folder

```bash
cd ../src/functions
```

Install packages if needed:

```bash
npm install
```

---

## 3️⃣ Start the Azure Functions locally

```bash
func start
```

You will see something like:

```
submitOrder: http://localhost:7071/api/submitOrder
processOrder: ServiceBusTrigger
```

---

## 4️⃣ Send a test order

Open **PowerShell / terminal** and run:

```bash
curl -X POST http://localhost:7071/api/submitOrder \
-H "Content-Type: application/json" \
-d "{\"orderId\":\"1004\",\"customer\":\"Test User\",\"items\":[\"tea\",\"cookies\"]}"
```

---

## 5️⃣ What will happen

```
HTTP request
   ↓
submitOrder function
   ↓
Message sent to Service Bus
   ↓
processOrder function triggered
   ↓
Order saved to Cosmos DB
```

---

## 6️⃣ Verify in Azure

Open Azure Portal:

```
Cosmos DB
 → Data Explorer
 → grocery-orders
 → orders
 → Items
```

You should see the new order document.

---

# 💰 When finished working

Run:

```bash
cd infra
terraform destroy
```

So your **Azure student credits don’t get consumed**.

---

✅ Your project structure is **actually very clean**.

If you want, I can also show you **3 small improvements that professors really like in Terraform projects** (cost control + reliability + cleaner architecture).
