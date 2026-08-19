import { AddCharacterForm } from "@/components/forms/add-character-form";
import { Player } from "@/lib/types/Player";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function AddCharacterPage() {
  return (
    <Suspense>
      <AddCharacterContent />
    </Suspense>
  );
}

async function AddCharacterContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <AddCharacterFormData />
    </div>
  );
}

async function AddCharacterFormData() {
  const supabase = await createClient();
  const { data: players, error } = await supabase.from("players").select();

  if (error) {
    return <p>Erreur lors du chargement des joueurs : {error.message}</p>;
  }

  return <AddCharacterForm players={(players ?? []) as Player[]} />;
}
