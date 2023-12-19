import { Print } from "./print.interface"
export interface Card {
  oracle_id: string,
  name: string,
  art_uri: string,
  prints: Print[]
}
