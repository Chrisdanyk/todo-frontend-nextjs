import ApiError from '@/lib/handlers/api-error'


export default class BaseController {
  constructor() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      // @ts-expect-error TypeScript binding workaround
      .filter((methodName: string): methodName is keyof this => {
        return (
          methodName !== 'constructor' &&
          typeof this[methodName as keyof this] === 'function'
        )
      })
      .forEach(methodName => {
        // TypeScript binding workaround
        this[methodName as keyof this] =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
          (this[methodName as keyof this] as Function).bind(this)
      })
  }

  protected handleError(error: unknown): never {
    if (error instanceof ApiError) {
      throw new Error(error.getErrorMessage())
    }

    throw error
  }
}
