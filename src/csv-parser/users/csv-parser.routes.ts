import { parseAndSaveCSV } from './csv-parser.services';
import { Hono } from 'hono';

// Entry point for CSV parser module

const csvParserApp = new Hono();

csvParserApp.post('/upload-csv', async (c) => {
  const body = await c.req.text(); // Assuming the CSV is sent as plain text
  const outputFilePath = parseAndSaveCSV(body);

  return c.json({
    message: 'CSV parsed and saved successfully!',
    outputPath: outputFilePath,
  });
});

export default csvParserApp;
