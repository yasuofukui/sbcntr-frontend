export type FetchWithRetryOptions = {
  /**
   * タイムアウト時間（ミリ秒）。デフォルトは10秒。
   */
  timeoutMs?: number;
  /**
   * リトライ回数（失敗後の再試行回数）。デフォルトは3回。
   * 例: retries=3 の場合、最大で 1(初回) + 3(リトライ) = 4回 試行します。
   */
  retries?: number;
  /**
   * バックオフの基準遅延（ミリ秒）。指数で増加します。デフォルトは500ms。
   */
  baseDelayMs?: number;
  /**
   * レスポンスを受け取った際に、追加のリトライ判定を行うフック。
   * true を返すとリトライ対象になります。
   */
  retryOn?: (response: Response) => boolean;
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number): boolean {
  // 5xx と 429 はデフォルトでリトライ対象
  return (status >= 500 && status <= 599) || status === 429;
}

function computeBackoffDelay(
  baseDelayMs: number,
  attemptIndexZeroBased: number
): number {
  const exponential = baseDelayMs * Math.pow(2, attemptIndexZeroBased);
  // ±10% のジッターを付与
  const jitterFactor = 0.9 + Math.random() * 0.2;
  return Math.round(exponential * jitterFactor);
}

/**
 *
 * @param input - RequestInfo | URL
 * @param init - RequestInit
 * @param opts - FetchWithRetryOptions
 * @param opts.timeoutMs - タイムアウト時間（msec）。デフォルトは10000ms（10秒）。
 * @param opts.retries - リトライ回数。デフォルトは3回。
 * @param opts.baseDelayMs - バックオフの基準遅延（msec）。デフォルトは500ms。
 * @param opts.retryOn - レスポンスを受け取った際に、追加のリトライ判定を行うフック。true を返すとリトライ対象になる。
 * @returns Promise<Response> リトライが成功した場合はResponseを返す
 * @throws Error リトライが失敗した場合はErrorを投げる、またはタイムアウトエラーが発生した場合はTimeoutErrorを投げる
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  opts?: FetchWithRetryOptions
): Promise<Response> {
  const timeoutMs = opts?.timeoutMs ?? 10_000;
  const retries = opts?.retries ?? 3;
  const baseDelayMs = opts?.baseDelayMs ?? 500;

  const externalSignal = init?.signal ?? undefined;

  // 最大試行回数 = 初回 + リトライ回数
  const maxAttempts = 1 + Math.max(0, retries);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(new DOMException("Timeout", "TimeoutError"));
    }, timeoutMs);

    // 外部から signal が渡された場合は、それが abort されたらこちらも中断する
    if (externalSignal) {
      if (externalSignal.aborted) {
        clearTimeout(timeoutId);
        controller.abort((externalSignal as any).reason);
      } else {
        const onAbort = () => controller.abort((externalSignal as any).reason);
        externalSignal.addEventListener("abort", onAbort, { once: true });
      }
    }

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const shouldRetry =
        (opts?.retryOn ? opts.retryOn(response) : false) ||
        isRetryableStatus(response.status);

      if (!shouldRetry || attempt === maxAttempts - 1) {
        return response;
      }

      // リトライ待機
      await sleep(computeBackoffDelay(baseDelayMs, attempt));
    } catch (error) {
      clearTimeout(timeoutId);
      // ネットワークエラーやタイムアウトはリトライ対象
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      // リトライ失敗時のログ。inputがURLの場合はURLをログに出力する。
      console.error(
        "Failed to fetch with retry on attempt:",
        attempt + 1,
        input instanceof URL ? input.toString() : ""
      );
      await sleep(computeBackoffDelay(baseDelayMs, attempt));
    }
  }

  throw new Error("fetchWithRetry: unexpected fallthrough"); // biome-ignore lint/correctness/noUnreachable: <explanation>
}
