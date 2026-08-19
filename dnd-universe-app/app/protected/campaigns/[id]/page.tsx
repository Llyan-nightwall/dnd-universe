import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageProps } from "@/lib/types/PageProps";
import { Campaign } from "@/lib/types/Campaign"

async function getCampaign(id: string): Promise<Campaign> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select()
    .eq("id", id);
  if (error) {
    throw new Error("Failed to fetch campaign");
  }
  if (!data || data.length === 0) {
    redirect("/protected/campaigns");
  }
  const { data: dm, error: dmError } = await supabase
    .from("players")
    .select()
    .eq("id", data[0].dm);

  if (dmError) {
    throw new Error("Failed to fetch DM");
  }
  return { ...data[0], dm: dm[0] };
}

export default function CampaignPage({ params }: PageProps) {
  return (
    <main>
      <Suspense fallback={<p>Loading campaign...</p>}>
        <CampaignContent params={params} />
      </Suspense>
    </main>
  );
}

async function CampaignContent({ params }: PageProps) {
  const { id } = await params;
  const campaign = await getCampaign(id);

  return (
    <>
      <h1>{campaign.name}</h1>
      <p>ID: {campaign.id}</p>
      <p>Description: {campaign.description}</p>
      <p>Level: {campaign.level}</p>
      <p>Created At: {campaign.created_at}</p>
      <p>Location: {campaign.location}</p>
      <p>DM: {campaign.dm.name}</p>
    </>
  );
}
