export class Card {
  id: string
  title: string
  description: string
  createdAt: Date

  constructor(title = '', description = '') {
    this.id = crypto.randomUUID()
    this.title = title
    this.description = description

    //для тестов
    const offsetMinutes = Math.floor(Math.random() * 17) - 2
    const offsetMs = offsetMinutes * 60 * 1000
    //для тестов

    this.createdAt = new Date(Date.now() + offsetMs)
  }
}
