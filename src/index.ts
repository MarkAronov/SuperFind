import { Hono } from 'hono'

import csvParserApp from './csv-parser/users/csv-parser.routes';

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/csv', csvParserApp);

export default app
