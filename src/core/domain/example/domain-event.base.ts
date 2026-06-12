/** Domain event base — payload follows the CloudEvents 1.0 spec. */
export abstract class DomainEvent<TData = unknown> {
  readonly specversion = '1.0' as const;
  readonly datacontenttype = 'application/json' as const;
  readonly time: string;

  protected constructor(
    readonly id: string,
    readonly type: string,
    readonly source: string,
    readonly data: TData,
    readonly correlationId?: string,
  ) {
    this.time = new Date().toISOString();
  }
}
