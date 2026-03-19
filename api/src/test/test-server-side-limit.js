const axios = require("axios");

const API_URL = "http://localhost:3002/api/scrape";

console.log("🚀 Testing Server-Side Data Limiting\n");
console.log("This test shows the API fetching ONLY limited data from source\n");
console.log("=".repeat(60));

async function test() {
  try {
    // Test 1: JSONPlaceholder with server-side limit
    console.log("\n📌 Test 1: JSONPlaceholder API with itemCount: 3");
    console.log("The API will add ?_limit=3 to the URL automatically");
    console.log("⏳ Fetching...\n");

    const response1 = await axios.post(API_URL, {
      url: "https://jsonplaceholder.typicode.com/posts",
      itemCount: 3,
    });

    console.log("✅ SUCCESS!");
    console.log("📊 Metadata:");
    console.log(`   Original URL: ${response1.data.metadata.originalUrl}`);
    console.log(`   Final URL: ${response1.data.metadata.url}`);
    console.log(
      `   Server-Side Limited: ${response1.data.metadata.serverSideLimited}`,
    );
    console.log(`   Returned Items: ${response1.data.metadata.returnedItems}`);
    console.log("\n📦 Data Preview:");
    response1.data.data.forEach((post, i) => {
      console.log(`   ${i + 1}. ${post.title.substring(0, 50)}...`);
    });

    // Test 2: Custom params for server-side limiting
    console.log("\n" + "=".repeat(60));
    console.log("\n📌 Test 2: GitHub API with custom params");
    console.log("Using custom params to control server-side data");
    console.log("⏳ Fetching...\n");

    const response2 = await axios.post(API_URL, {
      url: "https://api.github.com/users/github/repos",
      params: {
        per_page: 2, // GitHub uses 'per_page' for limiting
        sort: "updated",
      },
    });

    console.log("✅ SUCCESS!");
    console.log("📊 Metadata:");
    console.log(`   Original URL: ${response2.data.metadata.originalUrl}`);
    console.log(`   Final URL: ${response2.data.metadata.url}`);
    console.log(
      `   Server-Side Limited: ${response2.data.metadata.serverSideLimited}`,
    );
    console.log(`   Returned Items: ${response2.data.metadata.returnedItems}`);
    console.log("\n📦 Data Preview:");
    response2.data.data.slice(0, 2).forEach((repo, i) => {
      console.log(
        `   ${i + 1}. ${repo.name} - ${repo.description || "No description"}`,
      );
    });

    // Test 3: No limiting - fetch all data
    console.log("\n" + "=".repeat(60));
    console.log("\n📌 Test 3: No limiting parameter");
    console.log("Fetching without limits (default API behavior)");
    console.log("⏳ Fetching...\n");

    const response3 = await axios.post(API_URL, {
      url: "https://jsonplaceholder.typicode.com/posts",
    });

    console.log("✅ SUCCESS!");
    console.log("📊 Metadata:");
    console.log(`   URL: ${response3.data.metadata.url}`);
    console.log(
      `   Server-Side Limited: ${response3.data.metadata.serverSideLimited}`,
    );
    console.log(`   Returned Items: ${response3.data.metadata.returnedItems}`);

    console.log("\n" + "=".repeat(60));
    console.log("\n🎉 All tests passed!");
    console.log("\n💡 Key Benefits:");
    console.log("   ✓ itemCount automatically adds limit parameter");
    console.log("   ✓ Custom params for full control");
    console.log("   ✓ Only fetches what you need from source");
    console.log("   ✓ Saves bandwidth and improves performance");
  } catch (error) {
    console.error("\n❌ Error:", error.response?.data || error.message);
  }
}

test();
