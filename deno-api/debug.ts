#!/usr/bin/env -S deno run --allow-all

import { kv } from "./utils/kv.ts";

async function debugKV() {
  console.log("🔍 Debugging KV store...");
  
  try {
    // Test basic KV operations
    console.log("Testing KV operations...");
    
    // Try to set a test value
    const testKey = ["test", "debug"];
    const testValue = { message: "KV is working", timestamp: new Date().toISOString() };
    
    console.log("Setting test value...");
    await kv.set(testKey, testValue);
    console.log("✅ Set operation successful");
    
    // Try to get the test value
    console.log("Getting test value...");
    const result = await kv.get(testKey);
    console.log("✅ Get operation successful:", result.value);
    
    // Try to list keys
    console.log("Listing keys...");
    const entries = [];
    for await (const entry of kv.list({ prefix: [] })) {
      entries.push(entry.key);
    }
    console.log("✅ List operation successful, found", entries.length, "entries");
    
    // Clean up test data
    console.log("Cleaning up test data...");
    await kv.delete(testKey);
    console.log("✅ Delete operation successful");
    
    console.log("🎉 All KV operations working correctly!");
    
  } catch (error) {
    console.error("❌ KV operation failed:", error);
  } finally {
    if (typeof kv.close === 'function') {
      await kv.close();
    }
  }
}

debugKV();
