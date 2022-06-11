import { wait } from "../wait";

describe("utils - wait", () => {
  jest.useFakeTimers();

  it("should return a Promise that resolves after t seconds passed as param", async () => {
    const promise = wait(10);
    jest.advanceTimersByTime(10000); // 10000ms = 10s
    // undefined because the promise resolves without a value
    await expect(promise).resolves.toBe(undefined);
  });
});
