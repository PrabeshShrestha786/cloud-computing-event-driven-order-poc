resource "azurerm_service_plan" "func" {
  name                = "${var.prefix}-${var.env}-func-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  os_type  = "Windows"
  sku_name = "Y1" # Consumption
}

resource "azurerm_windows_function_app" "fa" {
  name                = "${var.prefix}-${var.env}-func"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  service_plan_id            = azurerm_service_plan.func.id
  storage_account_name       = azurerm_storage_account.func.name
  storage_account_access_key = azurerm_storage_account.func.primary_access_key

  https_only = true

  site_config {
    application_stack {
      node_version = "~18"
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"              = "node"
    "APPINSIGHTS_CONNECTION_STRING"         = azurerm_application_insights.appi.connection_string
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.appi.connection_string
  }

  tags = azurerm_resource_group.rg.tags
}

output "function_app_name" {
  value = azurerm_windows_function_app.fa.name
}
