
import { describe, it, expect } from 'vitest';
import { createWorkflow, WorkflowDefinition, ValidationResult } from '../src/workflow-engine';

// Define States
const PaymentState = {
    CREATED: 'CREATED',
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
    REJECTED: 'REJECTED',
    REFUNDED: 'REFUNDED'
};

// Define Context
interface PaymentContext {
    orderId: string;
    amount: number;
    paidAmount?: number;
    isDuplicate?: boolean;
}

// Define Workflow
const paymentWorkflowDef: WorkflowDefinition<PaymentContext> = {
    name: 'UepaPayPaymentWorkflow',
    initialState: PaymentState.CREATED,
    states: {
        [PaymentState.CREATED]: { name: PaymentState.CREATED },
        [PaymentState.PROCESSING]: { name: PaymentState.PROCESSING },
        [PaymentState.SUCCESS]: { name: PaymentState.SUCCESS, isTerminal: true }, // Usually terminal, unless refund
        [PaymentState.REJECTED]: { name: PaymentState.REJECTED, isTerminal: true },
        [PaymentState.REFUNDED]: { name: PaymentState.REFUNDED, isTerminal: true }
    },
    transitions: [
        {
            from: PaymentState.CREATED,
            to: PaymentState.PROCESSING,
            label: 'Start Processing'
        },
        {
            from: PaymentState.PROCESSING,
            to: PaymentState.SUCCESS,
            label: 'Payment Approved',
            guards: [
                ({ context }) => {
                    if (context.isDuplicate) {
                        return { allowed: false, reason: 'Duplicate payment detected' };
                    }
                    return true;
                },
                ({ context }) => {
                    if (context.paidAmount !== undefined && context.paidAmount < context.amount) {
                        return { allowed: false, reason: 'Insufficient payment amount' };
                    }
                    return true;
                }
            ]
        },
        {
            from: PaymentState.PROCESSING,
            to: PaymentState.REJECTED,
            label: 'Payment Declined'
        },
        {
            from: PaymentState.SUCCESS,
            to: PaymentState.REFUNDED,
            label: 'Refund Payment'
        }
    ]
};

describe('Payment Workflow Engine', () => {
    const engine = createWorkflow(paymentWorkflowDef);

    it('should initialize with correct state', () => {
        expect(engine.getInitialState()).toBe(PaymentState.CREATED);
    });

    it('should allow generic transition from CREATED to PROCESSING', () => {
        const result = engine.validate(PaymentState.CREATED, PaymentState.PROCESSING, { orderId: '123', amount: 100 });
        expect(result.allowed).toBe(true);
    });

    it('should validate guards for SUCCESS transition', () => {
        // Case 1: Insufficient amount
        const context1: PaymentContext = { orderId: '123', amount: 100, paidAmount: 50 };
        const result1 = engine.validate(PaymentState.PROCESSING, PaymentState.SUCCESS, context1);
        expect(result1.allowed).toBe(false);
        expect(result1.reason).toBe('Guards failed');
        expect(result1.errors).toContain('Insufficient payment amount');

        // Case 2: Duplicate
        const context2: PaymentContext = { orderId: '123', amount: 100, paidAmount: 100, isDuplicate: true };
        const result2 = engine.validate(PaymentState.PROCESSING, PaymentState.SUCCESS, context2);
        expect(result2.allowed).toBe(false);
        expect(result2.errors).toContain('Duplicate payment detected');

        // Case 3: Valid
        const context3: PaymentContext = { orderId: '123', amount: 100, paidAmount: 100, isDuplicate: false };
        const result3 = engine.validate(PaymentState.PROCESSING, PaymentState.SUCCESS, context3);
        expect(result3.allowed).toBe(true);
    });

    it('should prevent invalid transitions', () => {
        // Direct jump from CREATED to SUCCESS not allowed by definition
        const result = engine.validate(PaymentState.CREATED, PaymentState.SUCCESS, { orderId: '123', amount: 100 });
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('No transition defined');
    });
});
