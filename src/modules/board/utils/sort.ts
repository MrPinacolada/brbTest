import { Card } from "@/modules/board/models/card";

export function sortCardsAsc(cards: Card[]): Card[] {
  return [...cards].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
}

export function sortCardsDesc(cards: Card[]): Card[] {
  return [...cards].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}
