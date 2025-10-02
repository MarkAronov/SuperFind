# 🔍 Search Test Scenarios

Based on our static data (60 IT professionals), here are comprehensive test queries:

---

## 📊 **Test Data Overview**

### **By Role:**
- **Frontend Developers**: React, Vue.js specialists
- **Backend Developers**: Java, Node.js, Python
- **Full Stack Developers**: MERN stack
- **DevOps Engineers**: Docker, Kubernetes, AWS
- **Data Scientists**: Python, ML, SQL
- **ML/AI Engineers**: PyTorch, TensorFlow, NLP
- **Security Engineers**: Cybersecurity, Penetration Testing
- **Mobile Developers**: React Native, Flutter
- **Blockchain Developers**: Solidity, Web3
- **UX/UI Designers**: Figma, Sketch
- **Game Developers**: Unity, C#

### **By Location:**
- **USA**: San Francisco, Seattle, Austin, Boston, Denver, Chicago, Portland, Miami, Atlanta, Minneapolis, New York
- **Europe**: London, Madrid, Athens, Warsaw, Copenhagen, Dublin, Lisbon
- **Asia**: Tokyo, Shanghai, Mumbai, Delhi, Singapore
- **Other**: Vancouver, Rio de Janeiro, Cairo, Buenos Aires, Sydney

### **By Skills:**
- **Languages**: Python, JavaScript, TypeScript, Java, C#, Solidity
- **Frameworks**: React, Node.js, Django, Spring Boot, Vue.js
- **Cloud**: AWS, Azure, GCP, Kubernetes, Docker
- **AI/ML**: PyTorch, TensorFlow, Machine Learning, NLP

---

## 🎯 **Test Queries**

### **1. Skills-Based Searches**

```bash
# Python developers
curl -s "http://localhost:3000/ai/search?query=python%20developers"

# React specialists
curl -s "http://localhost:3000/ai/search?query=react%20developers"

# Machine Learning experts
curl -s "http://localhost:3000/ai/search?query=machine%20learning%20engineers"

# Kubernetes experience
curl -s "http://localhost:3000/ai/search?query=kubernetes%20docker%20experience"

# Blockchain developers
curl -s "http://localhost:3000/ai/search?query=blockchain%20solidity%20developers"
```

**Expected:**
- Should return people with matching skills
- Should prioritize exact skill matches
- Should include related roles (e.g., Full Stack for Python)

---

### **2. Location-Based Searches**

```bash
# People in San Francisco
curl -s "http://localhost:3000/ai/search?query=developers%20in%20san%20francisco"

# European developers
curl -s "http://localhost:3000/ai/search?query=software%20engineers%20in%20europe"

# Asia-based professionals
curl -s "http://localhost:3000/ai/search?query=developers%20in%20asia"

# Remote US developers
curl -s "http://localhost:3000/ai/search?query=united%20states%20developers"
```

**Expected:**
- Should find people in specified locations
- May include nearby cities or regions
- Europe query might be fuzzy (semantic search)

---

### **3. Role-Based Searches**

```bash
# DevOps engineers
curl -s "http://localhost:3000/ai/search?query=devops%20engineers"

# Frontend developers
curl -s "http://localhost:3000/ai/search?query=frontend%20developers"

# Data scientists
curl -s "http://localhost:3000/ai/search?query=data%20scientists"

# Security engineers
curl -s "http://localhost:3000/ai/search?query=security%20engineers"

# UX designers
curl -s "http://localhost:3000/ai/search?query=ux%20designers"
```

**Expected:**
- Should return people with exact role matches
- Should prioritize title over skills
- Should include seniority levels

---

### **4. Experience-Based Searches**

```bash
# Senior developers
curl -s "http://localhost:3000/ai/search?query=senior%20developers%20with%2010%20years"

# Junior developers
curl -s "http://localhost:3000/ai/search?query=developers%20with%203-5%20years%20experience"

# Expert level
curl -s "http://localhost:3000/ai/search?query=experts%20with%20extensive%20experience"
```

**Expected:**
- Should consider experience_years field
- Should understand seniority context
- May interpret "senior" vs years differently

---

### **5. Combined Queries (Complex)**

```bash
# Python developers in US
curl -s "http://localhost:3000/ai/search?query=python%20developers%20in%20united%20states"

# DevOps in Europe
curl -s "http://localhost:3000/ai/search?query=devops%20engineers%20in%20europe"

# React with TypeScript
curl -s "http://localhost:3000/ai/search?query=react%20developers%20with%20typescript"

# AWS cloud architects
curl -s "http://localhost:3000/ai/search?query=aws%20cloud%20architects"

# ML engineers with Python
curl -s "http://localhost:3000/ai/search?query=machine%20learning%20engineers%20python"
```

**Expected:**
- Should handle multiple criteria
- May weight one criterion over another
- Should return best semantic matches

---

### **6. Specific Technology Stacks**

```bash
# MERN stack
curl -s "http://localhost:3000/ai/search?query=mern%20stack%20developers"

# JAMstack
curl -s "http://localhost:3000/ai/search?query=javascript%20developers"

# Spring Boot
curl -s "http://localhost:3000/ai/search?query=spring%20boot%20java"

# Django Python
curl -s "http://localhost:3000/ai/search?query=django%20python%20developers"
```

**Expected:**
- Should match specific tech stacks
- Should find Full Stack developers for MERN
- Should prioritize exact stack matches

---

### **7. Edge Cases**

```bash
# Empty query
curl -s "http://localhost:3000/ai/search?query="

# Misspelling
curl -s "http://localhost:3000/ai/search?query=kubernets%20devloper"

# Very specific
curl -s "http://localhost:3000/ai/search?query=alice%20johnson"

# Non-existent skill
curl -s "http://localhost:3000/ai/search?query=cobol%20developers"

# Generic query
curl -s "http://localhost:3000/ai/search?query=developers"
```

**Expected:**
- Empty: Should return error
- Misspelling: Should still work (semantic search)
- Specific name: Should find Alice Johnson
- Non-existent: Should return "no relevant information"
- Generic: Should return top 5 relevant people

---

### **8. Natural Language Queries**

```bash
# Conversational
curl -s "http://localhost:3000/ai/search?query=who%20knows%20react%20and%20node"

# Question format
curl -s "http://localhost:3000/ai/search?query=find%20me%20experts%20in%20AI"

# Descriptive
curl -s "http://localhost:3000/ai/search?query=people%20with%20cloud%20experience"

# Requirements
curl -s "http://localhost:3000/ai/search?query=need%20someone%20who%20knows%20kubernetes"
```

**Expected:**
- Should understand natural language
- Should extract key terms (React, Node, AI, cloud, Kubernetes)
- Should return relevant results despite casual phrasing

---

## 📝 **Quick Test Commands**

### **Copy-Paste Test Suite:**

```bash
# Test 1: Python developers
echo "=== Test 1: Python Developers ===" && \
curl -s "http://localhost:3000/ai/search?query=python%20developers" | grep -o '"answer":"[^"]*"' | head -c 200

# Test 2: DevOps in Europe  
echo -e "\n\n=== Test 2: DevOps in Europe ===" && \
curl -s "http://localhost:3000/ai/search?query=devops%20from%20europe" | grep -o '"answer":"[^"]*"' | head -c 200

# Test 3: React developers
echo -e "\n\n=== Test 3: React Developers ===" && \
curl -s "http://localhost:3000/ai/search?query=react%20developers" | grep -o '"answer":"[^"]*"' | head -c 200

# Test 4: Machine Learning
echo -e "\n\n=== Test 4: Machine Learning ===" && \
curl -s "http://localhost:3000/ai/search?query=machine%20learning" | grep -o '"answer":"[^"]*"' | head -c 200

# Test 5: Blockchain
echo -e "\n\n=== Test 5: Blockchain ===" && \
curl -s "http://localhost:3000/ai/search?query=blockchain%20developers" | grep -o '"answer":"[^"]*"' | head -c 200
```

---

## ✅ **Expected Results Summary**

### **Good Matches (High Relevance):**
- ✅ "python developers" → Alice Chen, James Wilson, Robert Davis, Andrew Garcia, Dr. Sarah Chen
- ✅ "react developers" → Sarah Mitchell, Bob Smith, Edward Kim, Rachel Thompson (React Native)
- ✅ "devops engineers" → David Chen, Diana Rodriguez, Anna Kowalski
- ✅ "machine learning" → Alice Chen, James Wilson, Andrew Garcia, Priya Patel, Dr. Sarah Chen
- ✅ "blockchain" → Kevin Park, Maria Santos

### **Tricky Queries (Semantic Search):**
- ⚠️ "devops from europe" → Anna Kowalski (Poland) - may also return US-based DevOps
- ⚠️ "cloud architects" → Marcus Johnson, Christopher White - may include DevOps
- ⚠️ "AI experts" → May include ML engineers, data scientists, AI researchers

### **Should Fail Gracefully:**
- ❌ Empty query → Error "Query parameter is required"
- ❌ "cobol developers" → "I couldn't find any relevant information"

---

## 🎓 **Learning Points**

1. **Vector search is fuzzy** - "kubernetes" will match "docker" due to semantic similarity
2. **Location weight** - Skills often weighted higher than location in results
3. **Natural language works** - "who knows react" = "react developers"
4. **Misspellings handled** - Embeddings capture meaning despite typos
5. **Top 5 limit** - Only returns 5 most relevant sources

---

## 🚀 **Run All Tests**

```bash
# Create test script
cat > test-search.sh << 'ENDSCRIPT'
#!/bin/bash

echo "🔍 Testing SuperFind Search Functionality"
echo "=========================================="

tests=(
  "python%20developers:Python Developers"
  "react%20developers:React Developers"
  "devops%20from%20europe:DevOps in Europe"
  "machine%20learning:Machine Learning"
  "blockchain%20developers:Blockchain"
  "aws%20cloud:AWS Cloud"
  "frontend%20developers:Frontend Devs"
)

for test in "${tests[@]}"; do
  IFS=':' read -r query name <<< "$test"
  echo -e "\n\n📊 Test: $name"
  echo "Query: ${query//%20/ }"
  echo "----------------------------------------"
  curl -s "http://localhost:3000/ai/search?query=$query" | \
    grep -o '"answer":"[^"]*"' | \
    sed 's/"answer":"//' | \
    sed 's/"$//' | \
    head -c 300
  echo "..."
done

echo -e "\n\n✅ All tests completed!"
ENDSCRIPT

chmod +x test-search.sh
./test-search.sh
```
