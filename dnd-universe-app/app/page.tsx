import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Timeline, { TimelineEvent } from "@/components/timeline/timeline";
import { createClient } from "@/lib/supabase/server";

async function CampaignsData() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('campaigns').select()

  if (error) {
    return <p>Error loading campaigns: {error.message}</p>;
  }

  const events: TimelineEvent[] = data.map((campaign) => ({
    year: campaign.date,
    title: campaign.name,
    href: `/protected/campaigns/${campaign.id}`,
  }));

  return <div>
    <Timeline events={events} />
  </div>;
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-5 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>DND Universe</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <nav className="w-full flex justify-center gap-5 border-b border-b-foreground/10">
          <Button>
            <Link href={"/protected/characters"}>Personnages</Link>
          </Button>
          <Button>
            <Link href={"/protected/campaigns"}>Campagnes</Link>
          </Button>
          <Button>
            <Link href={"/protected/players"}>Joueurs</Link>
          </Button>
          <Button>
            <Link href={"/protected/characters/add"}>+Personnages</Link>
          </Button>
          <Button>
            <Link href={"/protected/campaigns/add"}>+Campagnes</Link>
          </Button>
          <Button>
            <Link href={"/protected/players/add"}>+Joueurs</Link>
          </Button>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Suspense>
            <CampaignsData />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
