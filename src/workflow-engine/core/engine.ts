import { WorkflowDefinition, StateIdentifier, ValidationResult } from "../types";
import { TransitionValidator } from "../validators/transition-validator";
import { InvalidTransitionError } from "../errors";

export class WorkflowEngine<TContext = any> {
    private validator: TransitionValidator;

    constructor(private definition: WorkflowDefinition<TContext>) {
        this.validator = new TransitionValidator<TContext>(definition);
    }

    public getInitialState(): StateIdentifier {
        return this.definition.initialState;
    }

    public validate(from: StateIdentifier, to: StateIdentifier, context: TContext): ValidationResult {
        return this.validator.validateTransition(from, to, context);
    }

    public assertTransition(from: StateIdentifier, to: StateIdentifier, context: TContext): void {
        const result = this.validate(from, to, context);
        if (!result.allowed) {
            throw new InvalidTransitionError(from, to, result.reason || result.errors?.join(", "));
        }
    }

    public getAllowedTransitions(from: StateIdentifier, context: TContext): StateIdentifier[] {
        return this.validator.getAllowedTransitions(from, context);
    }

    public getDefinition(): WorkflowDefinition<TContext> {
        return this.definition;
    }
}

export function createWorkflow<TContext = any>(definition: WorkflowDefinition<TContext>): WorkflowEngine<TContext> {
    return new WorkflowEngine(definition);
}
