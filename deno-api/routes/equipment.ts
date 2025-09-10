import { createRouter } from "../utils/router.ts";
import { KVStore, Equipment } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all equipment
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");
    const stationId = url.searchParams.get("stationId");

    let equipment = await KVStore.list<Equipment>("equipment", limit, offset);

    if (status) {
      equipment = equipment.filter(item => item.status === status);
    }
    if (type) {
      equipment = equipment.filter(item => item.type === type);
    }
    if (stationId) {
      equipment = equipment.filter(item => item.stationId === stationId);
    }

    return new Response(JSON.stringify(equipment), {
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

// Get equipment by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const equipment = await KVStore.get<Equipment>("equipment", id);

    if (!equipment) {
      return new Response(JSON.stringify({ error: "Equipment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(equipment), {
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

// Create equipment
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { name, type, stationId, serialNumber, purchaseDate, cost } = body;

    if (!name || !type || !stationId) {
      return new Response(JSON.stringify({ 
        error: "Name, type, and station ID are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const equipmentData = {
      name,
      type,
      stationId,
      serialNumber,
      status: "OUT_OF_SERVICE" as const,
      purchaseDate,
      cost,
      isActive: true
    };

    const equipment = await KVStore.create<Equipment>("equipment", equipmentData);

    return new Response(JSON.stringify(equipment), {
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

// Update equipment status
router.patch("/:id/status", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return new Response(JSON.stringify({ error: "Status is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const existingEquipment = await KVStore.get<Equipment>("equipment", id);
    if (!existingEquipment) {
      return new Response(JSON.stringify({ error: "Equipment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updatedEquipment = await KVStore.update<Equipment>("equipment", id, { status });

    return new Response(JSON.stringify(updatedEquipment), {
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

export { router as equipmentRoutes };

