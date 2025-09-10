#!/usr/bin/env -S deno run --allow-net

// Simple test to verify API is working
const BASE_URL = "http://localhost:8000";

async function testAPI() {
  console.log("🧪 Testing Fire Department API...\n");

  try {
    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const healthResponse = await fetch(`${BASE_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Health check passed:", healthData.status);
    } else {
      console.log("❌ Health check failed");
      return;
    }

    // Test root endpoint
    console.log("\n2. Testing root endpoint...");
    const rootResponse = await fetch(`${BASE_URL}/`);
    if (rootResponse.ok) {
      const rootData = await rootResponse.json();
      console.log("✅ Root endpoint passed:", rootData.message);
    } else {
      console.log("❌ Root endpoint failed");
      return;
    }

    // Test user registration
    console.log("\n3. Testing user registration...");
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@firedepartment.gov",
        name: "Test User",
        role: "CC_OPERATOR",
        badgeNumber: "TEST-001"
      })
    });

    if (registerResponse.ok) {
      const userData = await registerResponse.json();
      console.log("✅ User registration passed:", userData.email);
    } else {
      console.log("❌ User registration failed");
      return;
    }

    // Test station creation
    console.log("\n4. Testing station creation...");
    const stationResponse = await fetch(`${BASE_URL}/stations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Station",
        address: "123 Test St",
        latitude: 40.7128,
        longitude: -74.0060
      })
    });

    if (stationResponse.ok) {
      const stationData = await stationResponse.json();
      console.log("✅ Station creation passed:", stationData.name);
    } else {
      console.log("❌ Station creation failed");
      return;
    }

    console.log("\n🎉 All basic tests passed! API is working correctly.");
    
  } catch (error) {
    console.log("❌ Test failed with error:", error.message);
  }
}

if (import.meta.main) {
  testAPI();
}

