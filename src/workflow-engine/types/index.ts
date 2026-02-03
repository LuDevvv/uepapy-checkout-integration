export type StateIdentifier = string;

export interface ValidationResult {
    allowed: boolean;
    reason?: string;
    errors?: string[];
}

export interface TransitionContext<TContext = any> {
    from: StateIdentifier;
    to: StateIdentifier;
    context: TContext;
}

export type Guard<TContext = any> = (
    context: TransitionContext<TContext>
) => boolean | ValidationResult;

export interface TransitionDefinition<TContext = any> {
    from: StateIdentifier | StateIdentifier[];
    to: StateIdentifier;
    guards?: Guard<TContext>[];
    label?: string;
}

export interface StateDefinition<TContext = any> {
    name: StateIdentifier;
    description?: string;
    isTerminal?: boolean;
    meta?: Record<string, any>;
}

export interface WorkflowDefinition<TContext = any> {
    name: string;
    initialState: StateIdentifier;
    states: Record<StateIdentifier, StateDefinition<TContext>>;
    transitions: TransitionDefinition<TContext>[];
}
