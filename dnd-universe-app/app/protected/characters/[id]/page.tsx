import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageProps } from "@/lib/types/PageProps";
import { Character } from "@/lib/types/Character";

async function getCharacter(id: string): Promise<Character> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("characters")
    .select()
    .eq("id", id);
  if (error) {
    throw new Error("Failed to fetch character");
  }
  if (!data || data.length === 0) {
    redirect("/protected/characters");
  }
  const { data: player, error: playerError } = await supabase
    .from("players")
    .select()
    .eq("id", data[0].player_id);

  if (playerError) {
    throw new Error("Failed to fetch Player");
  }
  return { ...data[0], player: player[0] };
}

export default function CharacterPage({ params }: PageProps) {
  return (
    <main>
      <Suspense fallback={<p>Loading character...</p>}>
        <CharacterContent params={params} />
      </Suspense>
    </main>
  );
}

async function CharacterContent({ params }: PageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  return (
    <>
      <h1>{character.name}</h1>
      <p>ID: {character.id}</p>
      <p>Image: {character.image_path}</p>
      <p>Sheet: {character.sheet_path}</p>
      <p>Class: {character.class}</p>
      <p>Race: {character.race}</p>
      <p>Level: {character.level}</p>
      <p>Story: {character.story}</p>
      <p>Date of Birth: {character.date_of_birth}</p>
      <p>Player ID: {character.player.name}</p>
      <p>Created At: {character.created_at}</p>
    </>
  );
}
