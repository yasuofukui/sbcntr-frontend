import type { Route } from "./+types/home";
import { config } from "~/lib/config";

export function meta() {
  return [
    { title: "sample web app" },
    { name: "description", content: "Welcome to v2" },
  ];
}

export async function loader() {
  let dataBackendUrl = null;
  try {
    const responseBackendUrl = await fetch(
      `${config.api.backendUrl}/v1/helloworld/error`,
    ).catch((error) => {
      console.error("Error fetching data:", error);
      dataBackendUrl = {
        data: { message: "about info is not found" },
      };
    });

    if (responseBackendUrl instanceof Response && !dataBackendUrl) {
      dataBackendUrl = await responseBackendUrl.json();
    }
  } catch (error) {
    console.error("some error occurred", error);
    return {
      message: dataBackendUrl?.data.message ?? "about info is not found",
    };
  }

  return {
    message: dataBackendUrl.data.message,
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
