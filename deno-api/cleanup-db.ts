#!/usr/bin/env -S deno run --allow-net --allow-env --allow-kv

import { kv } from "./utils/kv.ts";

async function cleanupDatabase() {
  console.log("🧹 Starting database cleanup...");
  
  try {
    // List all keys to see what we have
    const allKeys = [];
    for await (const entry of kv.list({ prefix: [] })) {
      allKeys.push(entry.key);
    }
    
    console.log(`Found ${allKeys.length} entries in database`);
    
    // Delete all entries
    let deletedCount = 0;
    for (const key of allKeys) {
      await kv.delete(key);
      deletedCount++;
    }
    
    console.log(`✅ Deleted ${deletedCount} entries from database`);
    console.log("🎉 Database cleanup completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    // Close KV if it has a close method
    if (typeof kv.close === 'function') {
      await kv.close();
    }
  }
}

// Run cleanup
cleanupDatabase();
