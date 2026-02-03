type StateIdentifier = string;
interface ValidationResult {
    allowed: boolean;
    reason?: string;
    errors?: string[];
}
interface TransitionContext<TContext = any> {
    from: StateIdentifier;
    to: StateIdentifier;
    context: TContext;
}
type Guard<TContext = any> = (context: TransitionContext<TContext>) => boolean | ValidationResult;
interface TransitionDefinition<TContext = any> {
    from: StateIdentifier | StateIdentifier[];
    to: StateIdentifier;
    guards?: Guard<TContext>[];
    label?: string;
}
interface StateDefinition<TContext = any> {
    name: StateIdentifier;
    description?: string;
    isTerminal?: boolean;
    meta?: Record<string, any>;
}
interface WorkflowDefinition<TContext = any> {
    name: string;
    initialState: StateIdentifier;
    states: Record<StateIdentifier, StateDefinition<TContext>>;
    transitions: TransitionDefinition<TContext>[];
}

declare class WorkflowError extends Error {
    constructor(message: string);
}
declare class InvalidTransitionError extends WorkflowError {
    constructor(from: string, to: string, reason?: string);
}
declare class StateNotFoundError extends WorkflowError {
    constructor(state: string);
}
declare class GuardFailedError extends WorkflowError {
    constructor(from: string, to: string, reasons: string[]);
}

declare class TransitionValidator<TContext = any> {
    private definition;
    constructor(definition: WorkflowDefinition<TContext>);
    validateTransition(from: StateIdentifier, to: StateIdentifier, context: TContext): ValidationResult;
    getAllowedTransitions(from: StateIdentifier, context: TContext): StateIdentifier[];
}

declare class WorkflowEngine<TContext = any> {
    private definition;
    private validator;
    constructor(definition: WorkflowDefinition<TContext>);
    getInitialState(): StateIdentifier;
    validate(from: StateIdentifier, to: StateIdentifier, context: TContext): ValidationResult;
    assertTransition(from: StateIdentifier, to: StateIdentifier, context: TContext): void;
    getAllowedTransitions(from: StateIdentifier, context: TContext): StateIdentifier[];
    getDefinition(): WorkflowDefinition<TContext>;
}
declare function createWorkflow<TContext = any>(definition: WorkflowDefinition<TContext>): WorkflowEngine<TContext>;

export { type Guard, GuardFailedError, InvalidTransitionError, type StateDefinition, type StateIdentifier, StateNotFoundError, type TransitionContext, type TransitionDefinition, TransitionValidator, type ValidationResult, type WorkflowDefinition, WorkflowEngine, WorkflowError, createWorkflow };
