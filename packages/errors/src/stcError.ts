export class StcError extends Error {
  constructor(message: string, public code: number) {
    super(message);
  }
}
