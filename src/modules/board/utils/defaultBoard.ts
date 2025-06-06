import { Column } from '@/modules/board/models/column'
import { Card } from '@/modules/board/models/card'

export function getDefaultColumns(): Column[] {
  return [
    new Column('TODO', [
      new Card(
        'Add the ability to self-destruct when the user uses Internet Explorer 8'
      ),
      new Card(
        'Make our app loading 50% faster',
        'After a month when users notice the problem, then return everything to the way it was before to get a pay raise.'
      )
    ]),
    new Column('In Progress', [
      new Card(
        'Increase the price of the monthly subscription by 100% for users with an iOS & macOS'
      ),
      new Card(
        'Make our app loading 50% slower',
        'After a month when users notice the problem, then return everything to the way it was before to get a pay raise.'
      ),
      new Card(
        'Add the ability to self-destruct when the user uses Internet Explorer 7'
      )
    ]),
    new Column('Done', [
      new Card(
        'Add the ability to self-destruct when the user uses Mosaic Browser'
      )
    ])
  ]
}
