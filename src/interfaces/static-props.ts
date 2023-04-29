export type IStaticProps<T extends Record<string, unknown>> = Promise<{
  props: T
}>
