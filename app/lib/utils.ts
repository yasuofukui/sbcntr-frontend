import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * snake_case の文字列を camelCase に変換するユーティリティ関数
 */
function snakeToCamel(str: string): string {
  return str.replace(/([-_]\w)/g, (match) => match.charAt(1).toUpperCase());
}

/**
 * 入れ子になったオブジェクトや配列を再帰的に巡回し、
 * すべてのキーを camelCase に変換した新しい構造を返す関数
 */
export function convertKeysToCamelCase<T = Record<string, unknown>>(
  data: unknown | unknown[] | object,
): T {
  if (Array.isArray(data)) {
    // 配列の場合は、各要素に対して再帰的に処理
    return data.map((item) => convertKeysToCamelCase(item)) as T;
  } else if (data !== null && typeof data === "object") {
    // オブジェクトの場合は、キーを snake_case -> camelCase に変換
    const newObject: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const camelKey = snakeToCamel(key);
      newObject[camelKey] = convertKeysToCamelCase(value);
    }
    return newObject as T;
  }

  // プリミティブ型（文字列・数値・null・undefinedなど）はそのまま返す
  return data as unknown as T;
}
