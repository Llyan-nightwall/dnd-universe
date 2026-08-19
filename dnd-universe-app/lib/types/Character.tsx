import { Player } from "./Player";

export type Character = {
    id: string;
    name: string;
    image_path: string;
    player: Player;
    created_at: string;
    sheet_path: string;
    class: string;
    race: string;
    level: number;
    story: string;
    date_of_birth: number;
  };