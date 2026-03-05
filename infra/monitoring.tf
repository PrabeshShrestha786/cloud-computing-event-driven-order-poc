resource "azurerm_log_analytics_workspace" "law" {
  name                = "${var.prefix}-${var.env}-law"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = azurerm_resource_group.rg.tags
}

resource "azurerm_application_insights" "appi" {
  name                = "${var.prefix}-${var.env}-appi"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.law.id

  tags = azurerm_resource_group.rg.tags
}

output "appinsights_connection_string" {
  value     = azurerm_application_insights.appi.connection_string
  sensitive = true
}
