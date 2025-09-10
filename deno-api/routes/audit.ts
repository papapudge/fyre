import { createRouter } from "../utils/router.ts";
import { KVStore, AuditLog } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get audit logs
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const userId = url.searchParams.get("userId");
    const action = url.searchParams.get("action");
    const resource = url.searchParams.get("resource");

    let logs = await KVStore.list<AuditLog>("audit", limit, offset);

    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    if (action) {
      logs = logs.filter(log => log.action === action);
    }
    if (resource) {
      logs = logs.filter(log => log.resource === resource);
    }

    // Sort by timestamp descending (most recent first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return new Response(JSON.stringify(logs), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Create audit log
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { userId, action, resource, resourceId, details, ipAddress, userAgent } = body;

    if (!userId || !action || !resource) {
      return new Response(JSON.stringify({ 
        error: "User ID, action, and resource are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const logData = {
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString()
    };

    const log = await KVStore.create<AuditLog>("audit", logData);

    return new Response(JSON.stringify(log), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

export { router as auditRoutes };

