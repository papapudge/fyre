#!/usr/bin/env -S deno run --allow-all

import { kv, KVStore } from "./utils/kv.ts";

async function testMemory() {
  console.log("🧪 Testing in-memory KV store...");
  
  try {
    // Test basic operations
    console.log("Testing basic operations...");
    
    // Create a test item
    const testData = { name: "Test Station", id: "test-1" };
    const created = await KVStore.create("test", testData);
    console.log("✅ Created item:", created);
    
    // List items
    const items = await KVStore.list("test");
    console.log("✅ Listed items:", items);
    
    // Get specific item
    const retrieved = await KVStore.get("test", created.id);
    console.log("✅ Retrieved item:", retrieved);
    
    // Test with stations
    console.log("\nTesting with stations...");
    const stationData = { name: "Test Station", latitude: 28.6139, longitude: 77.2090 };
    const station = await KVStore.create("stations", stationData);
    console.log("✅ Created station:", station);
    
    const stations = await KVStore.list("stations");
    console.log("✅ Listed stations:", stations);
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testMemory();
