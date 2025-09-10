import { createRouter } from "../utils/router.ts";
import { KVStore, SystemConfig } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all system configs
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const isPublic = url.searchParams.get("isPublic");

    let configs = await KVStore.list<SystemConfig>("config");

    if (category) {
      configs = configs.filter(config => config.category === category);
    }
    if (isPublic !== null) {
      const publicFilter = isPublic === "true";
      configs = configs.filter(config => config.isPublic === publicFilter);
    }

    return new Response(JSON.stringify(configs), {
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

// Get config by key
router.get("/:key", async (req, params) => {
  try {
    const { key } = params!;
    const configs = await KVStore.findByField<SystemConfig>("config", "key", key);

    if (configs.length === 0) {
      return new Response(JSON.stringify({ error: "Config not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(configs[0]), {
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

// Create or update config
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { key, value, category, isPublic = false, updatedBy } = body;

    if (!key || !value || !category || !updatedBy) {
      return new Response(JSON.stringify({ 
        error: "Key, value, category, and updatedBy are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check if config already exists
    const existingConfigs = await KVStore.findByField<SystemConfig>("config", "key", key);
    
    if (existingConfigs.length > 0) {
      // Update existing config
      const updatedConfig = await KVStore.update<SystemConfig>("config", existingConfigs[0].id, {
        value,
        category,
        isPublic,
        updatedBy
      });

      return new Response(JSON.stringify(updatedConfig), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      // Create new config
      const configData = {
        key,
        value,
        category,
        isPublic,
        updatedBy
      };

      const config = await KVStore.create<SystemConfig>("config", configData);

      return new Response(JSON.stringify(config), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

export { router as configRoutes };

