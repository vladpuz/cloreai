import { AxiosError } from 'axios'

export class DatabaseError extends AxiosError {
  public constructor(...args: ConstructorParameters<typeof AxiosError>) {
    super(...args)
    this.name = 'DatabaseError'
  }
}

export class InvalidInputDataError extends AxiosError {
  public constructor(...args: ConstructorParameters<typeof AxiosError>) {
    super(...args)
    this.name = 'InvalidInputDataError'
  }
}

export class InvalidApiTokenError extends AxiosError {
  public constructor(...args: ConstructorParameters<typeof AxiosError>) {
    super(...args)
    this.name = 'InvalidApiTokenError'
  }
}

export class InvalidEndpointError extends AxiosError {
  public constructor(...args: ConstructorParameters<typeof AxiosError>) {
    super(...args)
    this.name = 'InvalidEndpointError'
  }
}

export class ExceededError extends AxiosError {
  public constructor(...args: ConstructorParameters<typeof AxiosError>) {
    super(...args)
    this.name = 'ExceededError'
  }
}

export class OtherError extends AxiosError {
  public constructor(...args: ConstructorParameters<typeof AxiosError>) {
    super(...args)
    this.name = 'OtherError'
  }
}

export class UnknownError extends AxiosError {
  public constructor(...args: ConstructorParameters<typeof AxiosError>) {
    super(...args)
    this.name = 'UnknownError'
  }
}
