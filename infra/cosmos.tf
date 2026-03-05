resource "azurerm_cosmosdb_account" "cosmos" {
  name                = "${var.prefix}-${var.env}-cosmos"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  offer_type = "Standard"
  kind       = "GlobalDocumentDB"

  # Student-credit friendly
  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }

  tags = azurerm_resource_group.rg.tags
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "grocery-orders"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
}

resource "azurerm_cosmosdb_sql_container" "orders" {
  name                = "orders"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
  database_name       = azurerm_cosmosdb_sql_database.db.name

  partition_key_paths   = ["/orderId"]
  partition_key_version = 2
}
