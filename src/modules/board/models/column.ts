import { Card } from './card'

export class Column {
  id: string
  title: string
  editing: boolean = true
  cards: Card[] = []

  constructor(title: string, cards: Card[] = []) {
    this.id = crypto.randomUUID()
    this.title = title
    this.cards = cards
  }

  addCard(card: Card) {
    this.cards.push(card)
    //тут изместный баг, карточки добавляются вразнобой из-за createdAt
  }

  removeCard(cardId: string) {
    this.cards = this.cards.filter(c => c.id !== cardId)
  }
}
