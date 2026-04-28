import { apiClientWithCookies } from "@/lib/api-client";
import { VolunteerProfileForm } from "./_components/volunteer-profile-form";

export default async function ProfilePage() {
  const client = await apiClientWithCookies();

  const res = await client.get("/api/volunteer/me");
  let initialData = null;

  if (res.ok) {
    const data = await res.json();
    initialData = data.volunteer;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">My Volunteer Profile</h1>
      <VolunteerProfileForm initialData={initialData} />
    </div>
  );
}
