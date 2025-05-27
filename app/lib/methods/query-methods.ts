import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'

import { ZodTypeAny } from 'zod'

type QueryFunction<T> = () => Promise<T>

type MutationFunction<T, V> = (variables: V) => Promise<T>

type CreateQueryOptions<T, S extends ZodTypeAny | undefined = undefined> = {
  schema?: S

  key: string | unknown[]

  fn: QueryFunction<T>

  options?: UseQueryOptions<T, Error>
}

type CreateMutationOptions<
  T,
  V = void,
  S extends ZodTypeAny | undefined = undefined
> = {
  schema?: S

  key: string | unknown[]

  fn: MutationFunction<T, V>

  options?: UseMutationOptions<T, Error, V>
}

const createQueryMethod = <T, S extends ZodTypeAny | undefined = undefined>({
  schema,
  key,
  fn,
  options
}: CreateQueryOptions<T, S>) => {
  return {
    useHook: () =>
      useQuery({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: async () => {
          const result = await fn()

          return schema ? schema.parse(result) : result
        },
        ...options
      })
  }
}

const createMutationMethod = <
  T,
  V = void,
  S extends ZodTypeAny | undefined = undefined
>({
  schema,
  key,
  fn,
  options
}: CreateMutationOptions<T, V, S>) => {
  return {
    useHook: () =>
      useMutation({
        mutationKey: Array.isArray(key) ? key : [key],
        mutationFn: async variables => {
          const result = await fn(variables)
          return schema ? schema.parse(result) : result
        },
        ...options
      })
  }
}

export { createMutationMethod, createQueryMethod }
