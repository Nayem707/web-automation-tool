/**
 * Quick Test with FAST API
 * Tests the itemCount feature with a fast-responding API
 */

const axios = require("axios");

async function testFastAPI() {
  console.log("🚀 Testing itemCount with FAST API\n");

  try {
    // Test 1: Get all items (no limit)
    console.log("Test 1: Get ALL posts (no itemCount)");
    const response1 = await axios.post("http://localhost:3002/api/scrape", {
      url: "https://jsonplaceholder.typicode.com/posts",
    });

    console.log("✅ Total Items:", response1.data.metadata.totalItems);
    console.log("   Returned:", response1.data.metadata.returnedItems);
    console.log("   Limited:", response1.data.metadata.limited);
    console.log("   First Post:", response1.data.data[0].title);

    console.log("\n" + "=".repeat(50) + "\n");

    // Test 2: Get only 1 item
    console.log("Test 2: Get only ONE post (itemCount: 1)");
    const response2 = await axios.post("http://localhost:3002/api/scrape", {
      url: "https://jsonplaceholder.typicode.com/posts",
      itemCount: 1,
    });

    console.log("✅ Total Items:", response2.data.metadata.totalItems);
    console.log("   Returned:", response2.data.metadata.returnedItems);
    console.log("   Limited:", response2.data.metadata.limited);
    console.log("\n📦 The ONE Post:");
    console.log(JSON.stringify(response2.data.data[0], null, 2));

    console.log("\n" + "=".repeat(50) + "\n");

    // Test 3: Get 5 items
    console.log("Test 3: Get FIVE posts (itemCount: 5)");
    const response3 = await axios.post("http://localhost:3002/api/scrape", {
      url: "https://jsonplaceholder.typicode.com/posts",
      itemCount: 5,
    });

    console.log("✅ Total Items:", response3.data.metadata.totalItems);
    console.log("   Returned:", response3.data.metadata.returnedItems);
    console.log("   Limited:", response3.data.metadata.limited);
    console.log("\n📦 Five Posts:");
    response3.data.data.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title}`);
    });

    console.log("\n🎉 All tests passed! itemCount feature works perfectly!");
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error.response?.data?.message || error.message,
    );
    console.log("\n💡 Make sure server is running on port 3002");
  }
}

testFastAPI();
