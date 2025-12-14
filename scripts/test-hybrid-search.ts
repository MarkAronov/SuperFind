export {};

const baseUrl = "http://localhost:3000";

async function testSearch(query: string, description: string) {
  console.log(`\n━━━ ${description} ━━━`);
  console.log(`Query: ${query}`);
  
  try {
    const response = await fetch(`${baseUrl}/ai/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✓ Found ${data.people?.length || 0} results`);
      console.log(`Answer: ${data.answer?.substring(0, 200)}...`);
      
      if (data.people && data.people.length > 0) {
        console.log("Top results:");
        data.people.slice(0, 3).forEach((p: { name: string; role: string; location: string; relevanceScore?: number }, i: number) => {
          console.log(`  ${i + 1}. ${p.name} - ${p.role} (${p.location}) - Score: ${p.relevanceScore?.toFixed(3)}`);
        });
      }
    } else {
      console.log(`✗ Error: ${data.error}`);
    }
  } catch (error) {
    console.log(`✗ Request failed: ${error}`);
  }
}

async function main() {
  console.log("Testing Hybrid Search Implementation\n");
  
  await testSearch("python developers", "Basic vector search");
  await testSearch("senior developers in Italy", "Location filter test");
  await testSearch("developers with kubernetes experience", "Skills keyword match");
  await testSearch("DevOps engineers with 5+ years experience", "Experience range filter");
}

main();
