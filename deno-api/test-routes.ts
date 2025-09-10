#!/usr/bin/env -S deno run --allow-all

import { createRouter } from "./utils/router.ts";
import { incidentRoutes } from "./routes/incidents.ts";

const router = createRouter();
router.use("/incidents", incidentRoutes);

// Test the router
async function testRouter() {
  console.log("🧪 Testing router...");
  
  const testRequest = new Request("http://localhost:8000/incidents/", {
    method: "GET"
  });
  
  try {
    const response = await router.handle(testRequest);
    if (response) {
      const text = await response.text();
      console.log("✅ Router response:", text);
    } else {
      console.log("❌ Router returned null");
    }
  } catch (error) {
    console.error("❌ Router error:", error);
  }
}

testRouter();
