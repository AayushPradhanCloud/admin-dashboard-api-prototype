/**
 * Domain exception hierarchy (KISS).
 *
 *   BaseException
 *     ├── DomainException        (400 family: client error in business terms)
 *     │     ├── ValidationException
 *     │     ├── BusinessRuleException
 *     │     └── EntityNotFoundException  (404)
 *     ├── ApplicationException   (use-case orchestration error)
 *     └── InfrastructureException(500 family: adapter/infra failures)
 *
 * The global AllExceptionsFilter maps each to the correct HTTP status.
 */

export abstract class BaseException extends Error {
  abstract readonly code: string;
  readonly cause?: unknown;

  protected constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = this.constructor.name;
    if (options?.cause !== undefined) this.cause = options.cause;
  }
}

export abstract class DomainException extends BaseException {}

export class ValidationException extends DomainException {
  readonly code = 'DOMAIN_VALIDATION';
  constructor(
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
  }
}

export class BusinessRuleException extends DomainException {
  readonly code = 'DOMAIN_BUSINESS_RULE';

  // Re-declared as public: BaseException's constructor is `protected`, and a
  // subclass with no constructor of its own inherits that same accessibility.
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(message: string) {
    super(message);
  }
}

export class EntityNotFoundException extends DomainException {
  readonly code = 'DOMAIN_ENTITY_NOT_FOUND';
  constructor(entity: string, identifier: string | number) {
    super(`${entity} with identifier "${String(identifier)}" was not found.`);
  }
}

export class ApplicationException extends BaseException {
  readonly code = 'APPLICATION_ERROR';

  // Re-declared as public: BaseException's constructor is `protected`, and a
  // subclass with no constructor of its own inherits that same accessibility.
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}

export class InfrastructureException extends BaseException {
  readonly code = 'INFRASTRUCTURE_ERROR';

  // Re-declared as public: BaseException's constructor is `protected`, and a
  // subclass with no constructor of its own inherits that same accessibility.
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}
