const baseUrl = "http://localhost:3000";

async function testPagination() {
	console.log("\n━━━ Testing Backend Pagination ━━━\n");

	// Test 1: First page (limit=5, offset=0)
	console.log("Test 1: First page (limit=5, offset=0)");
	const page1 = await fetch(
		`${baseUrl}/ai/search?query=developers&limit=5&offset=0`,
	);
	const data1 = await page1.json();
	console.log(`  Results: ${data1.people?.length || 0}`);
	console.log(`  Total: ${data1.total}`);
	console.log(`  HasMore: ${data1.hasMore}`);
	console.log(`  Limit: ${data1.limit}, Offset: ${data1.offset}\n`);

	// Test 2: Second page (limit=5, offset=5)
	console.log("Test 2: Second page (limit=5, offset=5)");
	const page2 = await fetch(
		`${baseUrl}/ai/search?query=developers&limit=5&offset=5`,
	);
	const data2 = await page2.json();
	console.log(`  Results: ${data2.people?.length || 0}`);
	console.log(`  Total: ${data2.total}`);
	console.log(`  HasMore: ${data2.hasMore}`);
	console.log(`  Limit: ${data2.limit}, Offset: ${data2.offset}\n`);

	// Test 3: Last page (limit=5, offset=15)
	console.log("Test 3: Page at offset 15");
	const page3 = await fetch(
		`${baseUrl}/ai/search?query=developers&limit=5&offset=15`,
	);
	const data3 = await page3.json();
	console.log(`  Results: ${data3.people?.length || 0}`);
	console.log(`  Total: ${data3.total}`);
	console.log(`  HasMore: ${data3.hasMore}`);
	console.log(`  Limit: ${data3.limit}, Offset: ${data3.offset}\n`);

	// Test 4: Beyond available results
	console.log("Test 4: Beyond available results (offset=100)");
	const page4 = await fetch(
		`${baseUrl}/ai/search?query=developers&limit=5&offset=100`,
	);
	const data4 = await page4.json();
	console.log(`  Results: ${data4.people?.length || 0}`);
	console.log(`  Total: ${data4.total}`);
	console.log(`  HasMore: ${data4.hasMore}`);
	console.log(`  Limit: ${data4.limit}, Offset: ${data4.offset}\n`);

	console.log("━━━ Pagination Tests Complete ━━━\n");
}

testPagination().catch(console.error);
