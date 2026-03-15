# CAP / PACELC Consistency Matrix

## Overview

The grocery order processing system uses different consistency approaches depending on the business importance of each data flow.

CAP theorem states that in the presence of a partition, a distributed system must trade off between consistency and availability. PACELC extends this by considering the trade-off between latency and consistency even when no partition occurs.

In this project, consistency choices are made based on the operational needs of each component.

## Consistency Matrix

| Flow / Component | Consistency Choice | Rationale |
|---|---|---|
| Order acceptance | Strong / Bounded Staleness | Prevent duplicate or conflicting order records |
| Payment status | Strong | Financial operations require correctness |
| Orders container | Session / Bounded Staleness | Supports reliable order reads while maintaining performance |
| Store task board projection | Eventual | Low-latency operational view is more important than immediate strict consistency |
| Inventory hints | Session / Eventual | Store-side hints can tolerate slight delay |

## CAP Perspective

Under a network partition, the system is designed to prefer availability for non-critical downstream projections while maintaining reliable order persistence in the main write path.

This means:

- the core order write path should preserve correctness
- downstream projections may temporarily lag behind
- the system continues operating even if all views are not immediately synchronized

## PACELC Perspective

When no partition exists, the architecture generally prefers lower latency for downstream operational views while preserving stronger consistency for critical business data.

Examples:

- order storage favors correctness and durability
- store task board favors responsiveness and resilience
- downstream event consumers can tolerate eventual consistency

## Design Implication

This consistency strategy supports the practical business needs of a click-and-collect grocery system.

Customer-facing order acceptance must remain trustworthy, while store operations benefit from fast and resilient updates even if projections are briefly delayed.