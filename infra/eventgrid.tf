resource "azurerm_eventgrid_topic" "orders" {
  name                = "${var.prefix}-${var.env}-orders-egtopic"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  tags = azurerm_resource_group.rg.tags
}

output "eventgrid_topic_endpoint" {
  value = azurerm_eventgrid_topic.orders.endpoint
}

output "eventgrid_topic_key" {
  value     = azurerm_eventgrid_topic.orders.primary_access_key
  sensitive = true
}
