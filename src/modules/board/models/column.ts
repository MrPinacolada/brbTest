import { Card } from './card'

export class Column {
  id: string
  title: string
  editing: boolean = true
  cards: Card[] = []

  constructor(title: string) {
    this.id = crypto.randomUUID()
    this.title = title
  }

  addCard(card: Card) {
    this.cards.push(card)
  }

  removeCard(cardId: string) {
    this.cards = this.cards.filter(c => c.id !== cardId)
  }
}
