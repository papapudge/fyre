import { createRouter } from "../utils/router.ts";
import { KVStore, MaintenanceRecord } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all maintenance records
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const type = url.searchParams.get("type");
    const stationId = url.searchParams.get("stationId");
    const vehicleId = url.searchParams.get("vehicleId");
    const equipmentId = url.searchParams.get("equipmentId");

    let records = await KVStore.list<MaintenanceRecord>("maintenance", limit, offset);

    if (type) {
      records = records.filter(record => record.type === type);
    }
    if (stationId) {
      records = records.filter(record => record.stationId === stationId);
    }
    if (vehicleId) {
      records = records.filter(record => record.vehicleId === vehicleId);
    }
    if (equipmentId) {
      records = records.filter(record => record.equipmentId === equipmentId);
    }

    // Sort by performedAt descending (most recent first)
    records.sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());

    return new Response(JSON.stringify(records), {
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

// Get maintenance record by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const record = await KVStore.get<MaintenanceRecord>("maintenance", id);

    if (!record) {
      return new Response(JSON.stringify({ error: "Maintenance record not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(record), {
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

// Create maintenance record
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { stationId, equipmentId, vehicleId, type, description, performedBy, cost } = body;

    if (!type || !description || !performedBy) {
      return new Response(JSON.stringify({ 
        error: "Type, description, and performedBy are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const recordData = {
      stationId,
      equipmentId,
      vehicleId,
      type,
      description,
      performedBy,
      performedAt: new Date().toISOString(),
      cost
    };

    const record = await KVStore.create<MaintenanceRecord>("maintenance", recordData);

    return new Response(JSON.stringify(record), {
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

export { router as maintenanceRoutes };

