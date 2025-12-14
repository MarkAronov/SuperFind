import { parseCSV } from "../src/parser/file-parsers";

const badCsvContent = `name,location,role,skills,experience_years,email,description
Robert Lee,Chicago, USA,,Cloud Computing; AWS; Terraform,,robert.lee@tech.com,Cloud professional with experience in infrastructure as code`;

console.log("Testing CSV Parser with malformed data...");
const result = parseCSV(badCsvContent);

console.log("Result:", JSON.stringify(result, null, 2));

if (result.length > 0) {
	const person = result[0];
	if (person.role === "" && person.location === "Chicago, USA") {
		console.log("SUCCESS: Parser correctly handled the malformed CSV row.");
	} else {
		console.log("FAILURE: Parser failed to correct the row.");
		console.log("Expected Role: ''");
		console.log("Actual Role:", person.role);
		console.log("Expected Location: 'Chicago, USA'");
		console.log("Actual Location:", person.location);
	}
} else {
	console.log("FAILURE: No results returned.");
}
