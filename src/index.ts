import { Hono } from "hono";
import aiRouter from "./ai/ai-routes";
import csvParserApp from "./parser/csv/csv-parser.routes";
import jsonParserApp from "./parser/json/json-parser.routes";
import textParserApp from "./parser/text/text-parser.routes";

const app = new Hono();

app.get("/", (c) => {
	return c.json({
		message: "SuperFind API",
		status: "running",
		version: "1.0.0",
	});
});
app.route("/csv", csvParserApp);
app.route("/json", jsonParserApp);
app.route("/text", textParserApp);
app.route("/ai", aiRouter);

export default app;
