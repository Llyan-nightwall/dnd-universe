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

type AddPlayerFormProps = React.ComponentPropsWithoutRef<"div">;

export function AddPlayerForm({
  className,
  ...props
}: AddPlayerFormProps) {
  const [name, setName] = useState("");
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
        .from("players")
        .insert({
          name
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/protected/players/${data.id}`);
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
          <CardTitle className="text-2xl">Nouveau Joueur</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer un Joueur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Margotte"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Création..." : "Créer le joueur"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/protected/players">Annuler</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
