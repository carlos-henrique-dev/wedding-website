export type IServerSideReturn<T extends Record<string, unknown>> = Promise<{
  props: T;
}>;
