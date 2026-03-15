# Governance and Security

## Overview

The grocery order processing system is deployed as a lightweight Azure-based proof of concept, but it still requires a basic governance and security model to ensure operational control, cost visibility, and least-privilege access.

This project applies governance principles in the areas of resource organization, access control, tagging, and secret management.

## Resource Organization

All project resources are deployed into a dedicated Azure Resource Group:

- `rg-prfx-dev`

This structure keeps the proof of concept isolated and makes it easier to manage deployment, monitoring, and cleanup.

## Role-Based Access Control (RBAC)

A minimal RBAC model is recommended for the project team.

| Role | Responsibility |
|---|---|
| Contributor | Development and deployment |
| Reader | Monitoring and review access |
| Key Vault Secrets User | Access to stored secrets where required |

This supports least-privilege access and reduces the risk of accidental changes by limiting permissions according to responsibility.

## Tagging Standards

To improve governance and cost tracking, Azure resources should use standard tags.

Recommended tags include:

- `env=dev`
- `team=cloud-course`
- `project=grocery-order`
- `owner=team`
- `cost-center=student`

These tags help with cost analysis, resource ownership, and future scaling of governance practices.

## Secret Management

Sensitive values such as connection strings and keys should not be hardcoded in source code.

In a production-ready version of the system, Azure Key Vault and Managed Identities should be used for secure secret access.

For this proof of concept, application settings are used, but the strategic operating model recommends migrating secrets to Key Vault.

## Policy Baseline

A basic Azure Policy baseline is recommended to support governance. Example policy goals include:

- enforce required tags
- restrict deployment regions to approved EU locations
- require monitoring to be enabled
- prevent insecure configurations

## Governance Value

Applying governance practices improves:

- operational consistency
- resource traceability
- security posture
- cost accountability

Even in a small proof of concept, governance helps demonstrate that the architecture can be extended toward production-ready cloud operations.