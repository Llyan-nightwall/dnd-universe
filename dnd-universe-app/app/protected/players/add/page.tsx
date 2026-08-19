import { AddPlayerForm } from "@/components/forms/add-player-form";
import { Player } from "@/lib/types/Player";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function AddPlayerPage() {
  return (
    <Suspense>
      <AddPlayerContent />
    </Suspense>
  );
}

async function AddPlayerContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <AddPlayerFormData />
    </div>
  );
}

async function AddPlayerFormData() {
  return <AddPlayerForm />;
}
