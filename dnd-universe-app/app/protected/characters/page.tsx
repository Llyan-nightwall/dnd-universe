import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function CharactersPage() {
  return (
    <div>
      <Suspense>
        <Characters />
      </Suspense>
    </div>
  );
}

async function Characters() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-2 items-start">
    <h1 className="font-bold text-2xl mb-4">Personnages</h1>
      <div>
        <CharactersData />
      </div>
    </div>
  );
}

async function CharactersData() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('characters').select()

  if (error) {
    return <p>Error loading characters: {error.message}</p>;
  }
  return <div>
    {data?.map((character) => (
      <Button asChild key={character.id}>
        <Link href={`/protected/characters/${character.id}`}>{character.name}</Link>
      </Button>
    ))}
  </div>;
}