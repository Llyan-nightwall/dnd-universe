import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function PlayersPage() {
  return (
    <div>
      <Suspense>
        <Players />
      </Suspense>
    </div>
  );
}

async function Players() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-2 items-start">
    <h1 className="font-bold text-2xl mb-4">Joueurs</h1>
      <div>
        <PlayersData />
      </div>
    </div>
  );
}

async function PlayersData() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('players').select()

  if (error) {
    return <p>Error loading players: {error.message}</p>;
  }
  return <div>
    {data?.map((player) => (
      <Button asChild key={player.id}>
        <Link href={`/protected/players/${player.id}`}>{player.name}</Link>
      </Button>
    ))}
  </div>;
}