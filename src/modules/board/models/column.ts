import { Card } from "./card";
import { reactive } from "vue";
export class Column {
  id: string;
  title: string;
  editing: boolean = true;
  cards: Card[] = [];
  updatedAt: Date;

  constructor(title: string, cards: Card[] = []) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.cards = reactive(cards);
    this.updatedAt = new Date();
  }

  touch() {
    this.updatedAt = new Date();
  }

  addCard(card: Card) {
    this.cards.push(card);
    //тут известный баг, карточки добавляются вразнобой из-за createdAt
    this.touch();
  }

  removeCard(cardId: string) {
    this.cards = this.cards.filter((c) => c.id !== cardId);
    this.touch();
  }

  shuffleCards() {
    this.cards = [...this.cards].sort(() => Math.random() - 0.5);
    this.touch();
  }

  sortCards(direction: "asc" | "desc") {
    this.cards.sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return direction === "asc" ? aTime - bTime : bTime - aTime;
    });
  }
}
