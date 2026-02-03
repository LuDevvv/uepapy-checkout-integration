# Workflow Engine Library

A lightweight, deterministic, and framework-agnostic state machine engine for validating workflow transitions.

## Features
- **Deterministic**: Pure logic validation.
- **Stateless**: The engine does not hold state; you pass the state and context to it.
- **Guard Support**: Define complex logic to allow/deny transitions.
- **TypeScript**: Written in strict TypeScript with full type safety.

## Installation

(Usage within this project)
Import from `src/workflow-engine`.

## usage

### 1. Define your Workflow

```typescript
import { createWorkflow, WorkflowDefinition } from './src/workflow-engine';

const myWorkflowDef: WorkflowDefinition = {
  name: 'OrderFlow',
  initialState: 'DRAFT',
  states: {
    DRAFT: { name: 'DRAFT' },
    PAID: { name: 'PAID' },
    SHIPPED: { name: 'SHIPPED' }
  },
  transitions: [
    { from: 'DRAFT', to: 'PAID' },
    { from: 'PAID', to: 'SHIPPED' }
  ]
};

const engine = createWorkflow(myWorkflowDef);
```

### 2. Validate Transitions

```typescript
const result = engine.validate('DRAFT', 'PAID', { amount: 100 });

if (result.allowed) {
    // Perform update in database
    console.log("Transition allowed!");
} else {
    console.error("Blocked:", result.reason);
}
```

### 3. Use Guards

```typescript
transitions: [
  {
    from: 'DRAFT',
    to: 'PAID',
    guards: [
      ({ context }) => context.amount > 0 || { allowed: false, reason: "Amount must be positive" }
    ]
  }
]
```

## Architecture
- **Core**: Contains the `WorkflowEngine` class.
- **Validators**: `TransitionValidator` handles the rule logic.
- **Types**: Pure interfaces.

Designed to be embedded in Node.js, serverless (Cloudflare Workers), or even frontend apps.
