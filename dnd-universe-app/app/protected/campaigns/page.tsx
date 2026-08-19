import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function CampaignsPage() {
  return (
    <div>
      <Suspense>
        <Campaigns />
      </Suspense>
    </div>
  );
}

async function Campaigns() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-2 items-start">
    <h1 className="font-bold text-2xl mb-4">Campagnes</h1>
      <div>
        <CampaignsData />
      </div>
    </div>
  );
}

async function CampaignsData() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('campaigns').select()

  if (error) {
    return <p>Error loading campaigns: {error.message}</p>;
  }
  return <div>
    {data?.map((campaign) => (
      <Button asChild key={campaign.id}>
        <Link href={`/protected/campaigns/${campaign.id}`}>{campaign.name}</Link>
      </Button>
    ))}
  </div>;
}