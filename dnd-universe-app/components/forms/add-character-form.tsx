"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Player } from "@/lib/types/Player";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AddCharacterFormProps = React.ComponentPropsWithoutRef<"div"> & {
  players: Player[];
};

export function AddCharacterForm({
  className,
  players,
  ...props
}: AddCharacterFormProps) {
  const [name, setName] = useState("");
  const [imagePath, setDescription] = useState("");
  const [level, setLevel] = useState("1");
  const [classe, setClasse] = useState("");
  const [race, setRace] = useState("");
  const [story, setStory] = useState("");
  const [dateOfBirth, setDate] = useState("");
  const [player, setPlayer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("characters")
        .insert({
          name,
          image_path: imagePath,
          level: parseInt(level, 10),
          class: classe,
          race,
          story,
          date_of_birth: parseInt(dateOfBirth, 10),
          player_id : player,
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/protected/characters/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nouveau Personnage</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer un Personnage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Naudolen OeuilDeRubis"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="classe">Classe</Label>
                <Input
                  id="classe"
                  placeholder="Druide"
                  value={classe}
                  onChange={(e) => setClasse(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="race">Race</Label>
                <Input
                  id="race"
                  placeholder="Elfe"
                  value={race}
                  onChange={(e) => setRace(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">Niveau</Label>
                <Input
                  id="level"
                  type="number"
                  min={1}
                  max={20}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Histoire</Label>
                <textarea
                  id="story"
                  placeholder="Racontez l'histoire de votre personnage..."
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={story}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Année de naissance</Label>
                <Input
                  id="date"
                  type="number"
                  placeholder="1491"
                  value={dateOfBirth}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dm">Joueur</Label>
                <select
                  id="joueur"
                  required
                  value={player}
                  onChange={(e) => setPlayer(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="" disabled>
                    Choisir un joueur
                  </option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Création..." : "Créer le personnage"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/protected/characters">Annuler</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
