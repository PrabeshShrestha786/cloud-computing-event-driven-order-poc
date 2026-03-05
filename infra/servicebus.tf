resource "azurerm_servicebus_namespace" "sb" {
  name                = "${var.prefix}-${var.env}-sbns"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Basic"

  tags = azurerm_resource_group.rg.tags
}

resource "azurerm_servicebus_queue" "orders" {
  name         = "orders-queue"
  namespace_id = azurerm_servicebus_namespace.sb.id



  # Basic reliability defaults
  max_delivery_count = 10
}
