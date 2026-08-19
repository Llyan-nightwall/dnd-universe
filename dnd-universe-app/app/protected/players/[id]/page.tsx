import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageProps } from "@/lib/types/PageProps";
import { Player } from "@/lib/types/Player";

async function getPlayer(id: string): Promise<Player> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select()
    .eq("id", id);
  if (error) {
    throw new Error("Failed to fetch player");
  }
  if (!data || data.length === 0) {
    redirect("/protected/players");
  }
  return data[0] as Player;
}

export default function PlayerPage({ params }: PageProps) {
  return (
    <main>
      <Suspense fallback={<p>Loading player...</p>}>
        <PlayerContent params={params} />
      </Suspense>
    </main>
  );
}

async function PlayerContent({ params }: PageProps) {
  const { id } = await params;
  const player = await getPlayer(id);

  return (
    <>
      <h1>{player.name}</h1>
      <p>ID: {player.id}</p>
    </>
  );
}
