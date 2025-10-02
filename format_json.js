const fs = require('fs');
const data = JSON.parse(fs.readFileSync('response.json', 'utf8'));

console.log('═══════════════════════════════════════════════════════════════');
console.log('��� API RESPONSE');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('✅ Success:', data.success);
console.log('❓ Query:', data.query);
console.log('��� Timestamp:', data.timestamp);
console.log('\n───────────────────────────────────────────────────────────────');
console.log('��� AI GENERATED ANSWER:');
console.log('───────────────────────────────────────────────────────────────\n');
console.log(data.answer);

console.log('\n───────────────────────────────────────────────────────────────');
console.log('��� SOURCES USED (Top', data.sources.length, 'relevant documents):');
console.log('───────────────────────────────────────────────────────────────\n');

data.sources.forEach((source, index) => {
    console.log(`[Source ${index + 1}]`);
    console.log(`ID: ${source.id}`);
    console.log(`Relevance Score: ${source.relevanceScore}`);
    console.log(`Content: ${source.content.substring(0, 200)}${source.content.length > 200 ? '...' : ''}`);
    console.log('');
});

console.log('═══════════════════════════════════════════════════════════════');
