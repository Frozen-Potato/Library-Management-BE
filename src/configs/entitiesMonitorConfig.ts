import { type MonitoredEntities } from '../types/MonitoringTypes.js'

const monitoredEntities: MonitoredEntities = {
  authors: {
    route: '/authors',
    logMessage: 'New author created with data: ',
  },
  books: {
    route: '/books',
    logMessage: 'New book created with data: ',
  },
  users: {
    route: '/users',
    logMessage: 'New user created with data: ',
  },
}

export default monitoredEntities
