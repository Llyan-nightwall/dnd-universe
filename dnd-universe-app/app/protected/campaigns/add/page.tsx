import { AddCampaignForm } from "@/components/forms/add-campaign-form";
import { Player } from "@/lib/types/Player";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function AddCampaignPage() {
  return (
    <Suspense>
      <AddCampaignContent />
    </Suspense>
  );
}

async function AddCampaignContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <AddCampaignFormData />
    </div>
  );
}

async function AddCampaignFormData() {
  const supabase = await createClient();
  const { data: players, error } = await supabase.from("players").select();

  if (error) {
    return <p>Erreur lors du chargement des joueurs : {error.message}</p>;
  }

  return <AddCampaignForm players={(players ?? []) as Player[]} />;
}
