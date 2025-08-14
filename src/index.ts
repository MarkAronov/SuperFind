import { Hono } from "hono";

import csvParserApp from "./csv-parser/users/csv-parser.routes";
import jsonParserApp from "./json-parser/users/json-parser.routes";
import textParserApp from "./text-parser/users/text-parser.routes";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.route("/csv", csvParserApp);
app.route("/json", jsonParserApp);
app.route("/text", textParserApp);

export default app;
