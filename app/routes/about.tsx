import type { Route } from "./+types/home";
import { config } from "~/lib/config";
import { fetchWithRetry } from "~/lib/http";

export function meta() {
  return [
    { title: "sample web app" },
    { name: "description", content: "Welcome to v2" }
  ];
}

export async function loader() {
  try {
    const res = await fetchWithRetry(
      `${config.api.backendUrl}/v1/helloworld/error`,
      undefined,
      { timeoutMs: 10_000, retries: 3 }
    );

    if (res.ok) {
      const json = (await res.json()) as { data: { message: string } };
      return { message: json.data.message };
    }
  } catch (error) {
    console.error("some error occurred", error);
  }

  return {
    message: "about info is not found"
  };
}

export default function About({ loaderData }: Route.ComponentProps) {
  const { message } = loaderData;
  return (
    <div>
      <h1>About</h1>
      <p>{message}</p>
    </div>
  );
}
