import * as Papa from 'papaparse';
import * as fs from 'fs';
import * as path from 'path';

// Service logic for CSV parser users
export const parseAndSaveCSV = (csvContent: string): string => {
  const parsedData = Papa.parse(csvContent, { header: true });

  const outputDir = path.join(process.cwd(), 'src', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outputFilePath = path.join(outputDir, 'output.json');
  fs.writeFileSync(outputFilePath, JSON.stringify(parsedData.data, null, 2));

  return outputFilePath;
};
