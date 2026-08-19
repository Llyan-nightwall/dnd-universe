import { Player } from "./Player";

export type Campaign = {
    id: string;
    name: string;
    description: string;
    level: number;
    created_at: string;
    location: string;
    dm: Player;
  };