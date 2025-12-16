import { config } from "~/lib/config";
import type { Route } from "../../../.react-router/types/app/routes/pets/+types/pet";

export async function action({ params, request }: Route.ActionArgs) {
  const { id } = params;

  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const { like, userId } = body;
  if (!like || !userId) {
    console.log("Missing required fields", like, userId, id, { body });
    return {
      status: 400,
      body: "Missing required fields"
    };
  }

  try {
    const response = await fetch(
      `${config.api.backendUrl}/v1/pets/${id}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          value: true
        })
      }
    );

    if (!response.ok) {
      return {
        body: "Failed to update like status",
        status: 500
      };
    }

    return {
      status: 200,
      body: await response.json()
    };
  } catch (error) {
    console.error("Error updating like status:", error);
    return { body: "Unknown error. Please try again.", status: 500 };
  }
}
