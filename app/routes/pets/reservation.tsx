import { config } from "~/lib/config";
import type { Route } from "../../../.react-router/types/app/routes/pets/+types/reservation";

export async function action({ params, request }: Route.ActionArgs) {
  const { id } = params;

  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const { userId, fullName, email, reservationDate } = body;
  if (!userId || !fullName || !email || !reservationDate) {
    console.log("Missing required fields", { body });
    return {
      status: 400,
      body: "Missing required fields"
    };
  }

  try {
    const response = await fetch(
      `${config.api.backendUrl}/v1/pets/${id}/reservation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          full_name: fullName,
          email,
          reservation_date: reservationDate
        })
      }
    );

    if (!response.ok) {
      return {
        body: "Failed to update like status",
        status: 500
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating like status:", error);
    return { body: "Failed to update like status", status: 500 };
  }
}

export default function ReservationPage() {
  return <div>hoge</div>;
}
