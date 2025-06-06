export class Card {
  id: string
  title: string
  description: string
  createdAt: Date

  constructor(title = '', description = '') {
    this.id = crypto.randomUUID()
    this.title = title
    this.description = description
    this.createdAt = new Date()
  }
}
