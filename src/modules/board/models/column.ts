import { Card } from "./card";
import { reactive } from "vue";
export class Column {
  id: string;
  title: string;
  editing: boolean = true;
  cards: Card[] = [];

  constructor(title: string, cards: Card[] = []) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.cards = reactive(cards);
  }

  addCard(card: Card) {
    this.cards.push(card);
    //тут известный баг, карточки добавляются вразнобой из-за createdAt
  }

  removeCard(cardId: string) {
    this.cards = this.cards.filter((c) => c.id !== cardId);
  }

  shuffleCards() {
    this.cards = [...this.cards].sort(() => Math.random() - 0.5);
  }

  sortCards(direction: "asc" | "desc") {
    this.cards.sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return direction === "asc" ? aTime - bTime : bTime - aTime;
    });
  }
}
