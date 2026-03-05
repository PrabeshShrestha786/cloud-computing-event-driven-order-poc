resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.prefix}-${var.env}"
  location = var.location

  tags = {
    env     = var.env
    team    = "PRFX"
    project = "cloud-computing"
  }
}

output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "location" {
  value = azurerm_resource_group.rg.location
}
