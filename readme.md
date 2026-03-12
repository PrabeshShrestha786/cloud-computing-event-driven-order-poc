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
  "COSMOS_KEY": "PASTE_KEY"
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
