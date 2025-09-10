# Fire Department Resource Management API

A comprehensive REST API for Fire Department Resource Management Platform built with Deno Deploy and Deno KV database.

## 🚀 Features

- **Authentication & Authorization** - User registration, login, and role-based access
- **Personnel Management** - Firefighter profiles, certifications, and status tracking
- **Vehicle Management** - Apparatus tracking, status updates, and location monitoring
- **Incident Management** - Complete incident lifecycle from creation to closure
- **Station Management** - Fire station information and resource allocation
- **Hydrant Management** - Water source tracking and maintenance
- **Assignment System** - Personnel and vehicle assignment to incidents
- **Notification System** - Real-time alerts and communication
- **Reporting System** - Incident reports and analytics
- **Audit Logging** - Complete system activity tracking

## 🛠️ Technology Stack

- **Runtime**: Deno Deploy
- **Database**: Deno KV (Key-Value store)
- **Language**: TypeScript
- **HTTP Server**: Deno Standard Library

## 📋 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify` - Verify authentication token
- `POST /auth/logout` - User logout

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Stations
- `GET /stations` - Get all stations
- `GET /stations/:id` - Get station by ID
- `POST /stations` - Create new station

### Vehicles
- `GET /vehicles` - Get all vehicles
- `GET /vehicles/:id` - Get vehicle by ID
- `POST /vehicles` - Create new vehicle
- `PATCH /vehicles/:id/location` - Update vehicle location
- `PATCH /vehicles/:id/status` - Update vehicle status

### Personnel
- `GET /personnel` - Get all personnel
- `GET /personnel/:id` - Get personnel by ID
- `POST /personnel` - Create personnel record
- `PATCH /personnel/:id/status` - Update personnel status

### Incidents
- `GET /incidents` - Get all incidents
- `GET /incidents/:id` - Get incident by ID
- `POST /incidents` - Create new incident
- `PATCH /incidents/:id/status` - Update incident status
- `POST /incidents/:id/assign` - Assign personnel/vehicles
- `GET /incidents/active` - Get active incidents
- `GET /incidents/nearby` - Get incidents by location

### Hydrants
- `GET /hydrants` - Get all hydrants
- `GET /hydrants/:id` - Get hydrant by ID
- `POST /hydrants` - Create new hydrant

### Assignments
- `GET /assignments` - Get all assignments
- `GET /assignments/:id` - Get assignment by ID
- `PATCH /assignments/:id/status` - Update assignment status

### Notifications
- `GET /notifications` - Get notifications for user
- `GET /notifications/:id` - Get notification by ID
- `POST /notifications` - Create notification
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/mark-all-read` - Mark all as read

### Reports
- `GET /reports` - Get all reports
- `GET /reports/:id` - Get report by ID
- `POST /reports` - Create report
- `POST /reports/incident-summary` - Generate incident summary

### Equipment
- `GET /equipment` - Get all equipment
- `GET /equipment/:id` - Get equipment by ID
- `POST /equipment` - Create equipment
- `PATCH /equipment/:id/status` - Update equipment status

### Maintenance
- `GET /maintenance` - Get maintenance records
- `GET /maintenance/:id` - Get maintenance record by ID
- `POST /maintenance` - Create maintenance record

### Audit
- `GET /audit` - Get audit logs
- `POST /audit` - Create audit log

### System Config
- `GET /config` - Get system configurations
- `GET /config/:key` - Get config by key
- `POST /config` - Create/update configuration

## 🚀 Getting Started

### Prerequisites
- Deno 1.40+ installed
- Deno Deploy account (for production deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deno-api
   ```

2. **Start the development server**
   ```bash
   deno task dev
   ```

3. **Run tests**
   ```bash
   deno run --allow-net --allow-env test-api.ts
   ```

### Production Deployment

1. **Deploy to Deno Deploy**
   ```bash
   # Connect your GitHub repository to Deno Deploy
   # The API will be automatically deployed
   ```

2. **Configure KV Database**
   - Create a KV database in Deno Deploy dashboard
   - Link it to your deployment

## 🧪 Testing

### Automated Test Suite
Run the comprehensive test suite:
```bash
deno run --allow-net --allow-env test-api.ts
```

### Postman Collection
Import the provided Postman collection (`postman-collection.json`) to test all endpoints manually.

### Test Coverage
The test suite covers:
- ✅ Health checks
- ✅ Authentication flow
- ✅ CRUD operations for all entities
- ✅ Status updates and state changes
- ✅ Assignment workflows
- ✅ Notification system
- ✅ Report generation

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  role: "ADMIN" | "CC_OPERATOR" | "FIELD_RESPONDER" | "DISPATCHER" | "SUPERVISOR" | "TRAINER";
  badgeNumber?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Incident
```typescript
interface Incident {
  id: string;
  incidentNumber: string;
  type: "FIRE" | "MEDICAL" | "RESCUE" | "HAZMAT" | "FALSE_ALARM" | "SERVICE_CALL" | "TRAINING" | "OTHER";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "DISPATCHED" | "EN_ROUTE" | "ON_SCENE" | "CONTAINED" | "CLOSED" | "CANCELLED";
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  reportedAt: string;
  // ... additional fields
}
```

## 🔒 Security

- **Authentication**: Token-based authentication
- **Authorization**: Role-based access control
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Request body validation
- **Audit Logging**: Complete activity tracking

## 📈 Performance

- **Response Time**: < 100ms for most operations
- **Concurrent Users**: Supports high concurrent load
- **Database**: Deno KV provides fast key-value operations
- **Caching**: Built-in caching for frequently accessed data

## 🐛 Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 📝 API Documentation

### Request/Response Format
All requests and responses use JSON format with `Content-Type: application/json`.

### Pagination
List endpoints support pagination:
```
GET /endpoint?limit=10&offset=0
```

### Filtering
Many endpoints support filtering:
```
GET /incidents?status=ACTIVE&type=FIRE&severity=HIGH
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the test cases for usage examples

---

**Fire Department Resource Management API** - Built with ❤️ using Deno Deploy

