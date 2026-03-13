Below is a **complete setup guide one can follow** (even if nothing installed).

---

# Setup Guide
**Stack:** Terraform + Azure Functions + Service Bus + Cosmos DB

---

# 1️⃣ Make sure you have enough credit in your Azure Student Account
1. Go to
   [https://azure.microsoft.com/free/students/](https://azure.microsoft.com/free/students/)
---

# 2️⃣ Install Required Software

You must install the following.

## Install Git

Download:

[https://git-scm.com/downloads](https://git-scm.com/downloads)

Verify:

```bash
git --version
```

---

## Install Node.js

Download **LTS version**

[https://nodejs.org](https://nodejs.org)

Verify:

```bash
node -v
npm -v
```

---

## Install Azure CLI

Download:

[https://learn.microsoft.com/en-us/cli/azure/install-azure-cli](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

Verify:

```bash
az version
```

---

## Install Terraform

Download:

[https://developer.hashicorp.com/terraform/downloads](https://developer.hashicorp.com/terraform/downloads)

Verify:

```bash
terraform -version
```

---

## Install Azure Functions Core Tools

### Windows (recommended)

Install **Chocolatey** first:
**Open Powershell as an admistrator and run the following command**

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = `
[System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Then install Functions tools:

```bash
choco install azure-functions-core-tools -y
```

Verify:

```bash
func --version
```

---

## Install VS Code (recommended)

[https://code.visualstudio.com/](https://code.visualstudio.com/)

Recommended extensions:

* Azure Tools
* Terraform
* Azure Functions
* Prettier

---

# 3️⃣ Clone the Project Repository

Run this:

```bash
git clone https://github.com/PrabeshShrestha786/cloud-computing-event-driven-order-poc.git
cd cloud-computing-event-driven-order-poc
```

---

# 4️⃣ Login to Azure

Authenticate with your **own Azure account**.

```bash
az login
```

A browser will open.

After login verify:

```bash
az account show
```

If multiple subscriptions exist:

```bash
az account set --subscription "<subscription-id>"
```

---

# 5️⃣ Create Azure Infrastructure

Navigate to Terraform folder:

```bash
cd infra
```

Initialize Terraform:

```bash
terraform init
```

Terraform will automatically download:

* Azure provider
* required plugins

Then create resources:

```bash
terraform apply
```

Confirm:

```
yes
```

This will create:

* Resource Group
* Service Bus namespace
* Service Bus queue
* Cosmos DB account
* Cosmos database
* Cosmos container
* Function App
* Storage Account
* Application Insights
* Log Analytics

---

# 6️⃣ Get Required Connection Strings

After Terraform deploys resources, you must retrieve credentials.

---

## Service Bus Connection String

Run:

```bash
az servicebus namespace authorization-rule keys list \
-g rg-prfx-dev \
--namespace-name prfx-dev-sbns \
-n RootManageSharedAccessKey \
--query primaryConnectionString -o tsv
```

Copy the value.

---

## Cosmos DB Endpoint

```bash
az cosmosdb show \
-g rg-prfx-dev \
-n prfx-dev-cosmos \
--query documentEndpoint -o tsv
```

---

## Cosmos DB Key

```bash
az cosmosdb keys list \
-g rg-prfx-dev \
-n prfx-dev-cosmos \
--query primaryMasterKey -o tsv
```

---


## Event Grid Topic Endpoint

```bash
az eventgrid topic show \
-g rg-prfx-dev \
-n prfx-dev-orders-egtopic \
--query endpoint -o tsv
```

---

## Event Grid Topic Key

```bash
az eventgrid topic key list \
-g rg-prfx-dev \
-n prfx-dev-orders-egtopic \
--query key1 -o tsv
```

---

# 7️⃣ Create Local Function Configuration

Inside the **src folder**, create file:

```
local.settings.json
```

Example:

```json
{
 "IsEncrypted": false,
 "Values": {
  "AzureWebJobsStorage": "UseDevelopmentStorage=true",
  "FUNCTIONS_WORKER_RUNTIME": "node",
  "ServiceBusConnection": "PASTE_SERVICE_BUS_CONNECTION_STRING",
  "COSMOS_ENDPOINT": "PASTE_ENDPOINT",
  "COSMOS_KEY": "PASTE_KEY",
  "EVENTGRID_TOPIC_ENDPOINT": "Paste Endpoint",
    "EVENTGRID_TOPIC_KEY": "Paste Key"
 }
}
```

⚠️ This file **will never be committed to GitHub as it is ignored by .gitignore and this is the personal file**.

---

# 8️⃣ Install Project Dependencies

Navigate to source folder:

```bash
cd src
```

Install dependencies:

```bash
npm install
```

This creates:

```
node_modules/
```

---

# 9️⃣ Run Azure Functions Locally

Start function runtime:

```bash
func start
```

Expected output:

```
submitOrder: http://localhost:7071/api/submitOrder
processOrder: serviceBusTrigger
```

---

# 🔟 Test the System (Open new git bash and run the following)

Send test order:

```bash
curl -X POST http://localhost:7071/api/submitOrder \
-H "Content-Type: application/json" \
-d '{"orderId":"1001","customer":"Test User","items":["milk","bread"]}'
```

Expected response:

```json
{
 "message": "Order submitted successfully"
}
```

---

# 1️⃣1️⃣ Verify Data in Cosmos DB

Open Azure Portal:

```
Cosmos DB
→ Data Explorer
→ grocery-orders
→ orders
→ Items
```

You should see order document.

Example like this:

```json
{
 "id": "1001",
 "orderId": "1001",
 "customer": "Test User",
 "items": ["milk","bread"],
 "status": "accepted"
}
```

---

# 1️⃣2️⃣ Stop Azure Resources When Finished

To avoid consuming **Azure student credits**, destroy infrastructure.

```bash
cd infra
terraform destroy
```

Confirm:

```
yes
```

All resources will be removed.


# This command to create subscription using topic-specific command
az eventgrid topic event-subscription create \
  -g rg-prfx-dev \
  --topic-name prfx-dev-orders-egtopic \
  -n egsub-storetaskboard \
  --endpoint "https://prfx-dev-func.azurewebsites.net/api/storeTaskBoardWebhook" \
  --included-event-types OrderProcessed





  Here is the full correct path from the beginning to the working Azure flow you just achieved.

# Full working flow from the beginning

## 1. Open the project and go to the Terraform folder

```bash
cd infra
```

## 2. Initialize Terraform

```bash
terraform init
```

## 3. Format and validate Terraform

```bash
terraform fmt
terraform validate
```

## 4. Review the Terraform plan

```bash
terraform plan
```

You should see the Azure resources to be created, including:

* resource group
* storage account
* function app
* service bus
* cosmos db
* application insights
* event grid topic

## 5. Apply the infrastructure

```bash
terraform apply
```

Type:

```text
yes
```

Wait until it completes successfully.

---

# 6. Confirm core Azure resources exist

Run these checks:

```bash
az group show -n rg-prfx-dev -o table
az functionapp show -g rg-prfx-dev -n prfx-dev-func --query "{name:name,state:state}" -o table
az eventgrid topic show -g rg-prfx-dev -n prfx-dev-orders-egtopic --query "{name:name,endpoint:endpoint}" -o table
az cosmosdb sql container show -g rg-prfx-dev -a prfx-dev-cosmos -d grocery-orders -n orders -o table
az cosmosdb sql container show -g rg-prfx-dev -a prfx-dev-cosmos -d grocery-orders -n storeTasks -o table
az servicebus queue show -g rg-prfx-dev --namespace-name prfx-dev-sbns -n orders-queue -o table
```

---

# 7. Fetch fresh runtime values

Because the infrastructure is newly created, all connection values are fresh.

## Service Bus connection string

```bash
az servicebus namespace authorization-rule keys list \
  -g rg-prfx-dev \
  --namespace-name prfx-dev-sbns \
  -n RootManageSharedAccessKey \
  --query primaryConnectionString \
  -o tsv
```

## Cosmos endpoint

```bash
az cosmosdb show \
  -g rg-prfx-dev \
  -n prfx-dev-cosmos \
  --query documentEndpoint \
  -o tsv
```

## Cosmos key

```bash
az cosmosdb keys list \
  -g rg-prfx-dev \
  -n prfx-dev-cosmos \
  --query primaryMasterKey \
  -o tsv
```

## Event Grid endpoint

```bash
az eventgrid topic show \
  -g rg-prfx-dev \
  -n prfx-dev-orders-egtopic \
  --query endpoint \
  -o tsv
```

## Event Grid key

```bash
az eventgrid topic key list \
  -g rg-prfx-dev \
  -n prfx-dev-orders-egtopic \
  --query key1 \
  -o tsv
```

Save all five values.

---

# 8. Update local settings for local testing

Edit `src/local.settings.json` and put the fresh values there.

Use this exact structure:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "ServiceBusConnection": "<fresh service bus connection string>",
    "COSMOS_ENDPOINT": "<fresh cosmos endpoint>",
    "COSMOS_KEY": "<fresh cosmos key>",
    "EVENTGRID_TOPIC_ENDPOINT": "<fresh event grid endpoint>",
    "EVENTGRID_TOPIC_KEY": "<fresh event grid key>"
  }
}
```

Make sure:

* JSON is valid
* no extra text after the closing `}`
* no trailing commas

---

# 9. Set Azure Function App settings

Azure does not use `local.settings.json`, so you must set the same values in the Function App.

```bash
az functionapp config appsettings set \
  -g rg-prfx-dev \
  -n prfx-dev-func \
  --settings \
  ServiceBusConnection="<fresh service bus connection string>" \
  COSMOS_ENDPOINT="<fresh cosmos endpoint>" \
  COSMOS_KEY="<fresh cosmos key>" \
  EVENTGRID_TOPIC_ENDPOINT="<fresh event grid endpoint>" \
  EVENTGRID_TOPIC_KEY="<fresh event grid key>"
```

Then set remote build settings:

```bash
az functionapp config appsettings set \
  -g rg-prfx-dev \
  -n prfx-dev-func \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true ENABLE_ORYX_BUILD=true
```

Then set Node version app setting:

```bash
az functionapp config appsettings set \
  -g rg-prfx-dev \
  -n prfx-dev-func \
  --settings WEBSITE_NODE_DEFAULT_VERSION=~22
```

Then restart:

```bash
az functionapp restart -g rg-prfx-dev -n prfx-dev-func
```

## Verify required settings exist

```bash
az functionapp config appsettings list \
  -g rg-prfx-dev \
  -n prfx-dev-func \
  --query "[?name=='ServiceBusConnection' || name=='COSMOS_ENDPOINT' || name=='COSMOS_KEY' || name=='EVENTGRID_TOPIC_ENDPOINT' || name=='EVENTGRID_TOPIC_KEY' || name=='WEBSITE_NODE_DEFAULT_VERSION'].name" \
  -o table
```

You should see:

* WEBSITE_NODE_DEFAULT_VERSION
* ServiceBusConnection
* COSMOS_ENDPOINT
* COSMOS_KEY
* EVENTGRID_TOPIC_ENDPOINT
* EVENTGRID_TOPIC_KEY

---

# 10. Go to the Functions project and install packages

```bash
cd ../src
npm install
```

---

# 11. Verify the function files exist

```bash
ls src/functions
```

You should see:

* `submitOrder.js`
* `processOrder.js`
* `storeTaskBoardWebhook.js`

---

# 12. Run local smoke test first

Start the local Functions host:

```bash
func start
```

You should see these functions:

* `submitOrder`
* `processOrder`
* `storeTaskBoardWebhook`

## Test local submitOrder

Open a second terminal and run:

```bash
curl -i -X POST "http://localhost:7071/api/submitOrder" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"2001","customer":"Test User","items":["milk","bread"],"storeId":"store-001"}'
```

Expected:

* `HTTP/1.1 200 OK`

Check the first terminal. You should see:

* `submitOrder` executed
* `processOrder` triggered
* Event Grid publish log
* Cosmos save log

## Test local webhook directly

```bash
curl -i -X POST "http://localhost:7071/api/storeTaskBoardWebhook" \
  -H "Content-Type: application/json" \
  -d '[{
    "id":"2",
    "eventType":"OrderProcessed",
    "subject":"/orders/3001",
    "eventTime":"2026-03-12T00:00:00Z",
    "data":{
      "orderId":"3001",
      "status":"accepted",
      "processedAt":"2026-03-12T00:00:00Z",
      "storeId":"store-001"
    },
    "dataVersion":"1.0"
  }]'
```

Expected response:

```json
{"ok":true,"processed":1}
```

Then stop the host with:

```text
Ctrl + C
```

---

# 13. Create the deployment zip

From your `src` folder:

```bash
powershell -NoProfile -Command "cd 'D:\Vamk\Cloud Computing\Project\src'; Compress-Archive -Path host.json,package.json,package-lock.json,src -DestinationPath functionapp.zip -Force"
```

Check that it exists:

```bash
ls -lh functionapp.zip
```

---

# 14. Deploy the Function App code to Azure

```bash
az functionapp deployment source config-zip \
  -g rg-prfx-dev \
  -n prfx-dev-func \
  --src functionapp.zip \
  --build-remote true
```

When it succeeds, restart the app:

```bash
az functionapp restart -g rg-prfx-dev -n prfx-dev-func
```

---

# 15. Confirm Azure sees the deployed functions

```bash
az functionapp function list \
  -g rg-prfx-dev \
  -n prfx-dev-func \
  --query "[].name" \
  -o table
```

You should see:

* `prfx-dev-func/processOrder`
* `prfx-dev-func/storeTaskBoardWebhook`
* `prfx-dev-func/submitOrder`

If they do not appear immediately:

* ensure `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
* ensure `ENABLE_ORYX_BUILD=true`
* redeploy once
* restart again
* wait about 30 seconds and retry

---

# 16. Inspect the Azure HTTP routes

This step matters because Azure exposed the routes in lowercase.

## Check submitOrder route

```bash
az functionapp function show \
  -g rg-prfx-dev \
  -n prfx-dev-func \
  --function-name submitOrder
```

Notice the `invokeUrlTemplate`, which was:

```text
https://prfx-dev-func.azurewebsites.net/api/submitorder
```

## Check webhook route

```bash
az functionapp function show \
  -g rg-prfx-dev \
  -n prfx-dev-func \
  --function-name storeTaskBoardWebhook
```

Notice the `invokeUrlTemplate`, which was:

```text
https://prfx-dev-func.azurewebsites.net/api/storetaskboardwebhook
```

This lowercase route was important.

---

# 17. Register Event Grid provider

```bash
az provider register --namespace Microsoft.EventGrid
```

Check:

```bash
az provider show --namespace Microsoft.EventGrid --query registrationState -o tsv
```

Expected:

```text
Registered
```

---

# 18. Test the webhook validation manually using the exact lowercase route

This step warmed up and verified the endpoint before creating the subscription.

```bash
curl -i -X POST "https://prfx-dev-func.azurewebsites.net/api/storetaskboardwebhook" \
  -H "Content-Type: application/json" \
  -d '[{
    "id":"1",
    "eventType":"Microsoft.EventGrid.SubscriptionValidationEvent",
    "subject":"",
    "eventTime":"2026-03-13T09:00:00Z",
    "data":{
      "validationCode":"test-code-123"
    },
    "dataVersion":"1.0",
    "metadataVersion":"1"
  }]'
```

Expected response:

```json
{"validationResponse":"test-code-123"}
```

This proved the Azure webhook endpoint was reachable and validation-ready.

---

# 19. Create the Event Grid subscription using the lowercase route

This exact endpoint mattered:

```bash
az eventgrid topic event-subscription create \
  -g rg-prfx-dev \
  --topic-name prfx-dev-orders-egtopic \
  -n egsub-storetaskboard \
  --endpoint "https://prfx-dev-func.azurewebsites.net/api/storetaskboardwebhook" \
  --included-event-types OrderProcessed
```

Then confirm:

```bash
az eventgrid topic event-subscription list \
  -g rg-prfx-dev \
  --topic-name prfx-dev-orders-egtopic \
  -o table
```

---

# 20. Test the full Azure flow

Use the lowercase submit route:

```bash
curl -i -X POST "https://prfx-dev-func.azurewebsites.net/api/submitorder" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"4001","customer":"Azure Test","items":["milk","bread"],"storeId":"store-001"}'
```

Expected:

* `HTTP/1.1 200 OK`

---

# 21. Check queue processing

```bash
az servicebus queue show \
  -g rg-prfx-dev \
  --namespace-name prfx-dev-sbns \
  -n orders-queue \
  --query "{active:countDetails.activeMessageCount, deadletter:countDetails.deadLetterMessageCount}" \
  -o table
```

Good result:

* `active = 0`
* `deadletter = 0`

That proves the worker processed the message and it did not dead-letter.

---

# 22. Verify Cosmos DB data in portal

## Orders container

Go to:

**Cosmos DB → `prfx-dev-cosmos` → Data Explorer → `grocery-orders` → `orders`**

Verify order `4001` exists.

## storeTasks container

Go to:

**Cosmos DB → `prfx-dev-cosmos` → Data Explorer → `grocery-orders` → `storeTasks`**

Verify projection exists with:

* `orderId: "4001"`
* `storeId: "store-001"`
* `taskState: "READY_FOR_PICKING"`

At this point the end-to-end flow is confirmed.

---

# Final working architecture you proved

`submitOrder → Service Bus → processOrder → Cosmos orders → Event Grid → storeTaskBoardWebhook → Cosmos storeTasks`

---

# Important lessons from this successful run

## 1. Azure app settings were required

After Terraform recreate, these had to be set manually:

* `ServiceBusConnection`
* `COSMOS_ENDPOINT`
* `COSMOS_KEY`
* `EVENTGRID_TOPIC_ENDPOINT`
* `EVENTGRID_TOPIC_KEY`

## 2. Local smoke test first was the right move

That proved the code worked before Azure deployment.

## 3. Remote build mattered

These helped Azure recognize the functions properly:

* `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
* `ENABLE_ORYX_BUILD=true`

## 4. The Azure HTTP routes were lowercase

This was crucial:

* `submitorder`
* `storetaskboardwebhook`

Using camel case in the Event Grid endpoint caused validation failure.

## 5. Queue counts were the fastest runtime proof

`active=0` and `deadletter=0` told you the worker path was healthy.

---

# One fix you should make now for future Terraform runs

Your `infra/functions.tf` still has:

```hcl
node_version = "~18"
```

Change it to:

```hcl
node_version = "~22"
```

So Terraform matches what you are now using.

---

# Short clean version

1. `terraform init`
2. `terraform fmt && terraform validate`
3. `terraform plan`
4. `terraform apply`
5. verify Azure resources
6. fetch fresh Service Bus, Cosmos, and Event Grid values
7. update `local.settings.json`
8. set Azure Function App settings
9. set remote build settings
10. set Node version app setting
11. restart Function App
12. `npm install`
13. local smoke test with `func start`
14. zip the `src` app
15. deploy zip with remote build
16. restart app
17. confirm functions appear in Azure
18. inspect exact `invokeUrlTemplate`
19. test webhook validation using lowercase route
20. create Event Grid subscription with lowercase route
21. send Azure test order
22. verify queue counts stay healthy
23. verify `orders` and `storeTasks` in Cosmos

If you want, I can turn this into a clean README section you can paste into GitHub.
