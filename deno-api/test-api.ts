#!/usr/bin/env -S deno run --allow-net --allow-env

/**
 * Comprehensive API Test Suite for Fire Department Resource Management Platform
 * Tests all endpoints and validates the complete system functionality
 */

const BASE_URL = "http://localhost:8000";
const TEST_RESULTS: { [key: string]: { passed: number; failed: number; tests: any[] } } = {};

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  response?: any;
}

class APITester {
  private baseUrl: string;
  private authToken: string = "";
  private userId: string = "";
  private stationId: string = "";
  private vehicleId: string = "";
  private incidentId: string = "";

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest(
    method: string,
    endpoint: string,
    body?: any,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    return await fetch(url, requestOptions);
  }

  private async test(
    name: string,
    testFn: () => Promise<boolean>,
    category: string = "general"
  ): Promise<TestResult> {
    try {
      const passed = await testFn();
      const result: TestResult = { name, passed };
      
      if (!TEST_RESULTS[category]) {
        TEST_RESULTS[category] = { passed: 0, failed: 0, tests: [] };
      }
      
      if (passed) {
        TEST_RESULTS[category].passed++;
        console.log(`✅ ${name}`);
      } else {
        TEST_RESULTS[category].failed++;
        console.log(`❌ ${name}`);
      }
      
      TEST_RESULTS[category].tests.push(result);
      return result;
    } catch (error) {
      const result: TestResult = { name, passed: false, error: error.message };
      
      if (!TEST_RESULTS[category]) {
        TEST_RESULTS[category] = { passed: 0, failed: 0, tests: [] };
      }
      
      TEST_RESULTS[category].failed++;
      TEST_RESULTS[category].tests.push(result);
      console.log(`❌ ${name}: ${error.message}`);
      return result;
    }
  }

  async runAllTests(): Promise<void> {
    console.log("🚒 Fire Department API Test Suite Starting...\n");

    // Health Check
    await this.testHealthCheck();
    
    // Authentication Tests
    await this.testAuthentication();
    
    // User Management Tests
    await this.testUserManagement();
    
    // Station Management Tests
    await this.testStationManagement();
    
    // Vehicle Management Tests
    await this.testVehicleManagement();
    
    // Personnel Management Tests
    await this.testPersonnelManagement();
    
    // Incident Management Tests
    await this.testIncidentManagement();
    
    // Hydrant Management Tests
    await this.testHydrantManagement();
    
    // Notification Tests
    await this.testNotifications();
    
    // Report Tests
    await this.testReports();

    this.printSummary();
  }

  private async testHealthCheck(): Promise<void> {
    console.log("🏥 Testing Health Check...");
    
    await this.test("Health endpoint returns 200", async () => {
      const response = await this.makeRequest("GET", "/health");
      return response.status === 200;
    }, "health");

    await this.test("API info endpoint returns 200", async () => {
      const response = await this.makeRequest("GET", "/");
      return response.status === 200;
    }, "health");
  }

  private async testAuthentication(): Promise<void> {
    console.log("\n🔐 Testing Authentication...");

    await this.test("User registration works", async () => {
      const response = await this.makeRequest("POST", "/auth/register", {
        email: "test@firedepartment.gov",
        name: "Test User",
        role: "CC_OPERATOR",
        badgeNumber: "TEST-001",
        phone: "(555) 123-4567"
      });
      
      if (response.status === 201) {
        const data = await response.json();
        this.userId = data.id;
        return true;
      }
      return false;
    }, "auth");

    await this.test("User login works", async () => {
      const response = await this.makeRequest("POST", "/auth/login", {
        email: "test@firedepartment.gov",
        password: "password123"
      });
      
      if (response.status === 200) {
        const data = await response.json();
        this.authToken = data.token;
        return true;
      }
      return false;
    }, "auth");

    await this.test("Token verification works", async () => {
      const response = await this.makeRequest("POST", "/auth/verify", {
        token: this.authToken
      });
      return response.status === 200;
    }, "auth");
  }

  private async testUserManagement(): Promise<void> {
    console.log("\n👥 Testing User Management...");

    await this.test("Get all users", async () => {
      const response = await this.makeRequest("GET", "/users");
      return response.status === 200;
    }, "users");

    await this.test("Get user by ID", async () => {
      const response = await this.makeRequest("GET", `/users/${this.userId}`);
      return response.status === 200;
    }, "users");

    await this.test("Update user", async () => {
      const response = await this.makeRequest("PUT", `/users/${this.userId}`, {
        name: "Test User Updated"
      });
      return response.status === 200;
    }, "users");
  }

  private async testStationManagement(): Promise<void> {
    console.log("\n🏢 Testing Station Management...");

    await this.test("Create station", async () => {
      const response = await this.makeRequest("POST", "/stations", {
        name: "Test Station",
        address: "123 Test St",
        latitude: 40.7128,
        longitude: -74.0060,
        phone: "(555) 123-4567",
        capacity: 20
      });
      
      if (response.status === 201) {
        const data = await response.json();
        this.stationId = data.id;
        return true;
      }
      return false;
    }, "stations");

    await this.test("Get all stations", async () => {
      const response = await this.makeRequest("GET", "/stations");
      return response.status === 200;
    }, "stations");

    await this.test("Get station by ID", async () => {
      const response = await this.makeRequest("GET", `/stations/${this.stationId}`);
      return response.status === 200;
    }, "stations");
  }

  private async testVehicleManagement(): Promise<void> {
    console.log("\n🚒 Testing Vehicle Management...");

    await this.test("Create vehicle", async () => {
      const response = await this.makeRequest("POST", "/vehicles", {
        unitId: "Test Engine 1",
        type: "ENGINE",
        name: "Test Engine 1",
        stationId: this.stationId,
        capabilities: ["Fire Suppression", "Rescue"],
        year: 2020,
        make: "Test Make",
        model: "Test Model"
      });
      
      if (response.status === 201) {
        const data = await response.json();
        this.vehicleId = data.id;
        return true;
      }
      return false;
    }, "vehicles");

    await this.test("Get all vehicles", async () => {
      const response = await this.makeRequest("GET", "/vehicles");
      return response.status === 200;
    }, "vehicles");

    await this.test("Update vehicle location", async () => {
      const response = await this.makeRequest("PATCH", `/vehicles/${this.vehicleId}/location`, {
        latitude: 40.7589,
        longitude: -73.9851
      });
      return response.status === 200;
    }, "vehicles");

    await this.test("Update vehicle status", async () => {
      const response = await this.makeRequest("PATCH", `/vehicles/${this.vehicleId}/status`, {
        status: "IN_SERVICE"
      });
      return response.status === 200;
    }, "vehicles");
  }

  private async testPersonnelManagement(): Promise<void> {
    console.log("\n👨‍🚒 Testing Personnel Management...");

    await this.test("Create personnel record", async () => {
      const response = await this.makeRequest("POST", "/personnel", {
        userId: this.userId,
        employeeId: "EMP-001",
        rank: "Captain",
        certifications: ["Firefighter I", "Firefighter II"],
        qualifications: ["Driver/Operator"],
        stationId: this.stationId
      });
      return response.status === 201;
    }, "personnel");

    await this.test("Get all personnel", async () => {
      const response = await this.makeRequest("GET", "/personnel");
      return response.status === 200;
    }, "personnel");

    await this.test("Update personnel status", async () => {
      const response = await this.makeRequest("PATCH", `/personnel/${this.userId}/status`, {
        status: "ON_DUTY"
      });
      return response.status === 200;
    }, "personnel");
  }

  private async testIncidentManagement(): Promise<void> {
    console.log("\n🚨 Testing Incident Management...");

    await this.test("Create incident", async () => {
      const response = await this.makeRequest("POST", "/incidents", {
        type: "FIRE",
        severity: "HIGH",
        title: "Test Structure Fire",
        description: "Test incident for API validation",
        latitude: 40.7128,
        longitude: -74.0060,
        address: "123 Test St",
        stationId: this.stationId,
        callerName: "Test Caller",
        callerPhone: "(555) 123-4567"
      });
      
      if (response.status === 201) {
        const data = await response.json();
        this.incidentId = data.id;
        return true;
      }
      return false;
    }, "incidents");

    await this.test("Get all incidents", async () => {
      const response = await this.makeRequest("GET", "/incidents");
      return response.status === 200;
    }, "incidents");

    await this.test("Update incident status", async () => {
      const response = await this.makeRequest("PATCH", `/incidents/${this.incidentId}/status`, {
        status: "DISPATCHED"
      });
      return response.status === 200;
    }, "incidents");

    await this.test("Assign personnel to incident", async () => {
      const response = await this.makeRequest("POST", `/incidents/${this.incidentId}/assign`, {
        userId: this.userId,
        vehicleId: this.vehicleId,
        role: "FIREFIGHTER"
      });
      return response.status === 201;
    }, "incidents");

    await this.test("Get active incidents", async () => {
      const response = await this.makeRequest("GET", "/incidents/active");
      return response.status === 200;
    }, "incidents");
  }

  private async testHydrantManagement(): Promise<void> {
    console.log("\n🚰 Testing Hydrant Management...");

    await this.test("Create hydrant", async () => {
      const response = await this.makeRequest("POST", "/hydrants", {
        hydrantId: "H-TEST-001",
        latitude: 40.7200,
        longitude: -74.0100,
        flowRate: 1000,
        pressure: 80,
        type: "DRY_BARREL"
      });
      return response.status === 201;
    }, "hydrants");

    await this.test("Get all hydrants", async () => {
      const response = await this.makeRequest("GET", "/hydrants");
      return response.status === 200;
    }, "hydrants");
  }

  private async testNotifications(): Promise<void> {
    console.log("\n🔔 Testing Notifications...");

    await this.test("Create notification", async () => {
      const response = await this.makeRequest("POST", "/notifications", {
        userId: this.userId,
        type: "GENERAL",
        title: "Test Notification",
        message: "This is a test notification",
        priority: "NORMAL"
      });
      return response.status === 201;
    }, "notifications");

    await this.test("Get notifications for user", async () => {
      const response = await this.makeRequest("GET", `/notifications?userId=${this.userId}`);
      return response.status === 200;
    }, "notifications");
  }

  private async testReports(): Promise<void> {
    console.log("\n📊 Testing Reports...");

    await this.test("Create report", async () => {
      const response = await this.makeRequest("POST", "/reports", {
        title: "Test Report",
        type: "CUSTOM",
        userId: this.userId,
        content: { test: "data" }
      });
      return response.status === 201;
    }, "reports");

    await this.test("Get all reports", async () => {
      const response = await this.makeRequest("GET", "/reports");
      return response.status === 200;
    }, "reports");

    await this.test("Generate incident summary", async () => {
      const response = await this.makeRequest("POST", "/reports/incident-summary", {
        incidentId: this.incidentId,
        userId: this.userId
      });
      return response.status === 201;
    }, "reports");
  }

  private printSummary(): void {
    console.log("\n" + "=".repeat(60));
    console.log("📋 TEST SUMMARY");
    console.log("=".repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;

    for (const [category, results] of Object.entries(TEST_RESULTS)) {
      console.log(`\n${category.toUpperCase()}:`);
      console.log(`  ✅ Passed: ${results.passed}`);
      console.log(`  ❌ Failed: ${results.failed}`);
      console.log(`  📊 Total: ${results.passed + results.failed}`);
      
      totalPassed += results.passed;
      totalFailed += results.failed;

      if (results.failed > 0) {
        console.log("  Failed tests:");
        results.tests
          .filter(test => !test.passed)
          .forEach(test => {
            console.log(`    - ${test.name}: ${test.error || "Unknown error"}`);
          });
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`🎯 OVERALL RESULTS:`);
    console.log(`  ✅ Total Passed: ${totalPassed}`);
    console.log(`  ❌ Total Failed: ${totalFailed}`);
    console.log(`  📊 Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
    console.log("=".repeat(60));

    if (totalFailed === 0) {
      console.log("🎉 All tests passed! The API is working correctly.");
    } else {
      console.log("⚠️  Some tests failed. Please review the errors above.");
    }
  }
}

// Main execution
async function main() {
  const tester = new APITester(BASE_URL);
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Test suite failed:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}

