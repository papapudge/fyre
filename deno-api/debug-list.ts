#!/usr/bin/env -S deno run --allow-all

import { kv, KVStore } from "./utils/kv.ts";

async function debugList() {
  console.log("🔍 Debugging list operation...");
  
  try {
    // Create a test item
    const testData = { name: "Test Station", latitude: 28.6139, longitude: 77.2090 };
    const created = await KVStore.create("stations", testData);
    console.log("✅ Created station:", created);
    
    // Debug the list operation
    console.log("🔍 Debugging list operation...");
    const entries = kv.list({ prefix: ["stations"] });
    
    let count = 0;
    for await (const entry of entries) {
      console.log("Found entry:", entry);
      count++;
    }
    console.log(`Total entries found: ${count}`);
    
    // Try the KVStore.list method
    console.log("🔍 Testing KVStore.list...");
    const stations = await KVStore.list("stations");
    console.log("KVStore.list result:", stations);
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

debugList();
