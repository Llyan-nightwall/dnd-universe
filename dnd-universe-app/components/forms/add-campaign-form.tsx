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

type AddCampaignFormProps = React.ComponentPropsWithoutRef<"div"> & {
  players: Player[];
};

export function AddCampaignForm({
  className,
  players,
  ...props
}: AddCampaignFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("1");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [dm, setDm] = useState("");
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
        .from("campaigns")
        .insert({
          name,
          description,
          level: parseInt(level, 10),
          location,
          date: parseInt(date, 10),
          dm,
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/protected/campaigns/${data.id}`);
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
          <CardTitle className="text-2xl">Nouvelle campagne</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer une campagne
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Les Mines de Phandelver"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Décrivez la campagne..."
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">Niveau</Label>
                <Input
                  id="level"
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  placeholder="Faerûn, Sword Coast"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Année (chronologie)</Label>
                <Input
                  id="date"
                  type="number"
                  placeholder="1491"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dm">Maître du jeu</Label>
                <select
                  id="dm"
                  required
                  value={dm}
                  onChange={(e) => setDm(e.target.value)}
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
                  {isLoading ? "Création..." : "Créer la campagne"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/protected/campaigns">Annuler</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
