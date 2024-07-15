import { AxiosError } from 'axios'

export type AxiosErrorParameters = ConstructorParameters<typeof AxiosError>

export class DatabaseError extends AxiosError {
  public constructor(...args: AxiosErrorParameters) {
    super(...args)
    this.name = 'DatabaseError'
  }
}

export class InvalidInputDataError extends AxiosError {
  public constructor(...args: AxiosErrorParameters) {
    super(...args)
    this.name = 'InvalidInputDataError'
  }
}

export class InvalidApiTokenError extends AxiosError {
  public constructor(...args: AxiosErrorParameters) {
    super(...args)
    this.name = 'InvalidApiTokenError'
  }
}

export class InvalidEndpointError extends AxiosError {
  public constructor(...args: AxiosErrorParameters) {
    super(...args)
    this.name = 'InvalidEndpointError'
  }
}

export class ExceededError extends AxiosError {
  public constructor(...args: AxiosErrorParameters) {
    super(...args)
    this.name = 'ExceededError'
  }
}

export class CustomError extends AxiosError {
  public constructor(...args: AxiosErrorParameters) {
    super(...args)
    this.name = 'CustomError'
  }
}

export class UnknownError extends AxiosError {
  public constructor(...args: AxiosErrorParameters) {
    super(...args)
    this.name = 'UnknownError'
  }
}
