export function assertDefined(
  condition: unknown,
  message: string
): asserts condition {
  if (condition === null || condition === undefined) {
    throw new Error(message);
  }
}
