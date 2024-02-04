import mongoose from 'mongoose'

import { type Author } from '../../types/Author.js'

const ObjectId = mongoose.Types.ObjectId

export const authorsData: Array<
  Partial<Author & { _id: mongoose.Types.ObjectId }>
> = [
  {
    _id: new mongoose.Types.ObjectId('6546a7febac08f6bd30c0505'),
    firstName: 'Leo',
    lastName: 'Tolstoy',
    books: [
      new ObjectId('655d13daf50dd1ceca878b43'),
      new ObjectId('655ec8104202fd2aa0055472'),
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('6546a7febac08f6bd30c0505'),
    firstName: 'Leo',
    lastName: 'Messi',
    books: [
      new ObjectId('655d13daf50dd1ceca878b43'),
      new ObjectId('655ec8104202fd2aa0055472'),
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('6546a899f28fbf438938fb11'),
    firstName: 'William',
    lastName: 'Shakespeare',
    books: [
      new ObjectId('6546a899f28fbf438938fb12'),
      new ObjectId('6546a899f28fbf438938fb13'),
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('6546a914e0e22e2341124948'),
    firstName: 'Jane',
    lastName: 'Austen',
    books: [
      new ObjectId('6546a914e0e22e2341124949'),
      new ObjectId('6546a914e0e22e2341124950'),
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('6546a923e0e22e234112494a'),
    firstName: 'George',
    lastName: 'Orwell',
    books: [
      new ObjectId('6546a923e0e22e234112494b'),
      new ObjectId('6546a923e0e22e234112494f'),
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('6546a92ee0e22e234112494c'),
    firstName: 'Jules',
    lastName: 'Verne',
    books: [
      new ObjectId('6546a923e0e22e234112494d'),
      new ObjectId('6546a92ee0e22e234112494e'),
    ],
  },
]
