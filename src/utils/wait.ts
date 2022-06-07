/**
 * Resolve after t seconds
 * @param t number of seconds to wait
 */
export async function wait(t: number) {
  return new Promise((res) => {
    setTimeout(res, t * 1000);
  });
}
