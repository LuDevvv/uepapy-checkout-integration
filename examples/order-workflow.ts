
import { createWorkflow, WorkflowDefinition } from '../src/workflow-engine';

// Define context
interface OrderContext {
    orderId: string;
    amount: number;
}

// Define workflow
const orderWorkflow: WorkflowDefinition<OrderContext> = {
    name: 'SimpleOrderWorkflow',
    initialState: 'PENDING',
    states: {
        PENDING: { name: 'PENDING' },
        PAID: { name: 'PAID' },
        CANCELLED: { name: 'CANCELLED', isTerminal: true }
    },
    transitions: [
        {
            from: 'PENDING',
            to: 'PAID',
            label: 'Pay Order',
            guards: [
                ({ context }) => context.amount > 0 || { allowed: false, reason: 'Amount must be positive' }
            ]
        },
        {
            from: 'PENDING',
            to: 'CANCELLED',
            label: 'Cancel Order'
        }
    ]
};

// Initialize engine
const engine = createWorkflow(orderWorkflow);

// Validate a transition
const context = { orderId: '123', amount: 50 };
const result = engine.validate('PENDING', 'PAID', context);

console.log('Transition Result:', result); // { allowed: true }

const invalidContext = { orderId: '124', amount: 0 };
const invalidResult = engine.validate('PENDING', 'PAID', invalidContext);

console.log('Invalid Transition Result:', invalidResult); // { allowed: false, reason: 'Guards failed', errors: ['Amount must be positive'] }
