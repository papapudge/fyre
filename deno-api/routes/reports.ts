import { createRouter } from "../utils/router.ts";
import { KVStore, Report } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all reports
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");
    const userId = url.searchParams.get("userId");

    let reports = await KVStore.list<Report>("reports", limit, offset);

    if (type) {
      reports = reports.filter(report => report.type === type);
    }
    if (status) {
      reports = reports.filter(report => report.status === status);
    }
    if (userId) {
      reports = reports.filter(report => report.userId === userId);
    }

    // Sort by createdAt descending (most recent first)
    reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Response(JSON.stringify(reports), {
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

// Get report by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const report = await KVStore.get<Report>("reports", id);

    if (!report) {
      return new Response(JSON.stringify({ error: "Report not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(report), {
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

// Create report
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { title, type, incidentId, userId, content } = body;

    if (!title || !type || !userId || !content) {
      return new Response(JSON.stringify({ 
        error: "Title, type, user ID, and content are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const reportData = {
      title,
      type,
      incidentId,
      userId,
      content,
      status: "DRAFT" as const
    };

    const report = await KVStore.create<Report>("reports", reportData);

    return new Response(JSON.stringify(report), {
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

// Update report
router.put("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();

    const existingReport = await KVStore.get<Report>("reports", id);
    if (!existingReport) {
      return new Response(JSON.stringify({ error: "Report not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updatedReport = await KVStore.update<Report>("reports", id, body);

    return new Response(JSON.stringify(updatedReport), {
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

// Update report status
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

    const existingReport = await KVStore.get<Report>("reports", id);
    if (!existingReport) {
      return new Response(JSON.stringify({ error: "Report not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updateData: any = { status };

    // Set generatedAt when status changes to published
    if (status === "PUBLISHED" && !existingReport.generatedAt) {
      updateData.generatedAt = new Date().toISOString();
    }

    const updatedReport = await KVStore.update<Report>("reports", id, updateData);

    return new Response(JSON.stringify(updatedReport), {
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

// Generate incident summary report
router.post("/incident-summary", async (req) => {
  try {
    const body = await req.json();
    const { incidentId, userId } = body;

    if (!incidentId || !userId) {
      return new Response(JSON.stringify({ 
        error: "Incident ID and user ID are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get incident data
    const incident = await KVStore.get("incidents", incidentId);
    if (!incident) {
      return new Response(JSON.stringify({ error: "Incident not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get assignments for this incident
    const assignments = await KVStore.findByField("assignments", "incidentId", incidentId);

    // Generate report content
    const content = {
      incident: incident,
      assignments: assignments,
      summary: {
        totalPersonnel: assignments.length,
        totalVehicles: assignments.filter(a => a.vehicleId).length,
        duration: incident.closedAt ? 
          new Date(incident.closedAt).getTime() - new Date(incident.reportedAt).getTime() : 
          null,
        injuries: incident.injuries,
        fatalities: incident.fatalities,
        estimatedLoss: incident.estimatedLoss
      },
      generatedAt: new Date().toISOString()
    };

    const reportData = {
      title: `Incident Summary - ${incident.incidentNumber}`,
      type: "INCIDENT_SUMMARY" as const,
      incidentId,
      userId,
      content,
      status: "PUBLISHED" as const,
      generatedAt: new Date().toISOString()
    };

    const report = await KVStore.create<Report>("reports", reportData);

    return new Response(JSON.stringify(report), {
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

export { router as reportRoutes };

