# Agricultural Vehicle Management System 🚜

A comprehensive, full-stack agricultural management platform with modern React frontend and robust Node.js backend, designed to streamline farm operations, vehicle tracking, operator management, and resource optimization through intelligent automation and real-time analytics.

## 🌾 Project Overview

The Agricultural Vehicle Management System is a modern web application that enables agricultural enterprises to efficiently manage their entire operation ecosystem. Built with Next.js frontend and Node.js backend, the system provides real-time insights, automated workflows, and comprehensive analytics for modern farming operations.

### Key Value Propositions

- **Operational Efficiency**: Reduce operational overhead by up to 25% through optimized resource allocation
- **Real-time Monitoring**: Live tracking of vehicles, operations, and fuel consumption with GPS integration
- **Cost Management**: Advanced analytics for fuel consumption, maintenance costs, and operational expenses
- **Compliance**: Automated license tracking and certification management for operators
- **Data-Driven Decisions**: Real-time dashboards with predictive insights for strategic planning
- **Scalability**: Modular architecture supporting operations from small farms to large agricultural enterprises

---

## 🎨 Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS with custom component library
- **State Management**: Zustand for global state, React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **UI Components**: Custom component library with shadcn/ui base
- **Internationalization**: Multi-language support (i18n)

### 📱 Page Structure & Features

#### **Authentication Pages**

- **Login Page** (`/login`)
  
  - Secure authentication with JWT tokens
  - Form validation with error handling
  - Password recovery integration

- **Register Page** (`/register`)
  
  - User registration with role assignment
  - Email verification workflow

- **Password Recovery**
  
  - Forgot password dialog component
  - Email-based password reset

#### **Main Dashboard** (`/dashboard`)

**Components Used:**

- `InfoWidgets` - Real-time KPI widgets
- `Charts` - Data visualization components
- `TrackerMap` - Live GPS tracking map

**Key Metrics Displayed:**

- Total fuel consumption (liters)
- Total fields managed
- Active vehicles count
- Today's operations count
- Total operators registered

#### **Fields Management** (`/fields`)

**Components:**

- `FieldsTable` - Comprehensive fields listing with sorting/filtering
- `FieldForm` - Create/edit field forms with validation

**Features:**

- Field area calculations and statistics
- Operation history per field
- Utilization analytics
- Size-based categorization

#### **Vehicles Management** (`/vehicles`)

**Components:**

- `VehiclesTable` - Fleet inventory with status tracking
- `VehicleForm` - Vehicle registration and updates
- `VehicleStatusChart` - Status distribution visualization
- `VehicleTypeChart` - Fleet composition analysis
- `VehicleUtilizationChart` - Utilization metrics

**Features:**

- Real-time vehicle status monitoring
- Maintenance scheduling alerts
- Fleet analytics and reporting
- Serial number and license plate tracking

#### **Operations Management** (`/operations`)

**Components:**

- `OperationsTable` - Operation lifecycle management
- `OperationForm` - Operation planning and execution

**Features:**

- Operation lifecycle tracking (planned → active → completed)
- Real-time progress monitoring
- Cross-module validation (vehicle, operator, field)
- Performance analytics and efficiency calculations

#### **Operators Management** (`/operators`)

**Components:**

- Operator listing and management interface
- License tracking and certification monitoring
- Performance analytics dashboard

**Features:**

- License expiration alerts
- Performance tracking and skill assessment
- Status management (active, inactive, suspended)
- Operation history and efficiency metrics

#### **Fuel Management** (`/refuel`)

**Components:**

- Fuel transaction recording interface
- Cost analysis and efficiency reporting
- Consumption analytics dashboard

**Features:**

- Real-time fuel consumption tracking
- Cost per operation analysis
- Vehicle efficiency monitoring
- Monthly trend analysis

#### **Vehicle Tracking** (`/trackers`)

**Components:**

- GPS tracker management interface
- Real-time location monitoring
- Online/offline status tracking

**Features:**

- Live GPS tracking with map integration
- Device management and configuration
- Status monitoring (online, offline)
- Bulk operations for fleet management

#### **User & Role Management** (`/users`, `/roles`)

**Components:**

- User management interface
- Role assignment and permissions
- Language preferences

**Features:**

- Multi-role user management
- Dynamic role assignment
- Language localization support
- User activity tracking

#### **Settings** (`/settings`)

- System configuration
- User preferences
- Language settings

### 🔧 Frontend Architecture Patterns

#### **Feature-Based Structure**

```
src/
├── features/
│   ├── Dashboard/
│   │   ├── components/       # UI components
│   │   ├── hooks/           # Feature-specific hooks
│   │   ├── InfoWidgets/     # Widget components
│   │   └── Charts/          # Chart components
│   ├── Fields/
│   │   ├── components/      # FieldsTable, FieldForm
│   │   ├── hooks/          # useFields hook
│   │   └── config/         # Table columns, validation schema
│   ├── Vehicles/
│   │   ├── components/      # VehiclesTable, Charts
│   │   ├── hooks/          # useVehicles hook
│   │   └── config/         # Configuration files
│   └── [Other Features]...
```

#### **Shared Hook Pattern - `useEntityCRUD`**

All features use a standardized CRUD hook pattern:

```typescript
// Example: useFields hook
const {
  fields,              // Data array
  isFieldsLoading,     // Loading state
  createField,         // Create function
  updateField,         // Update function
  deleteField,         // Delete function
  refetch              // Refresh data
} = useFields();
```

**Benefits:**

- Consistent API interaction patterns
- Automatic error handling with toast notifications
- Optimistic UI updates with React Query
- Cache invalidation and synchronization

#### **Component Library Structure**

```
components/
├── ui/                      # shadcn/ui base components
├── NTable/                  # Advanced table component
├── NForm/                   # Form components with validation
├── NDialogForm/             # Modal forms
├── NButtons/                # Button variants
├── NInputs/                 # Input components
├── NBadge/                  # Status badges
├── NStatusBadge/            # Status indicators
├── NSidebar/                # Navigation sidebar
├── Nnavbar/                 # Top navigation
└── BaseChart.tsx            # Chart base component
```

### 🔄 Frontend Data Flow

#### **API Communication Layer**

Each module has dedicated API service files:

- `authApi.ts` - Authentication endpoints
- `fieldApi.ts` - Fields management
- `vehicleApi.ts` - Vehicle operations
- `operationApi.ts` - Operations management
- `operatorApi.ts` - Operator management
- `refuelApi.ts` - Fuel tracking
- `trackerApi.ts` - GPS tracking
- `userApi.ts` - User management
- `roleApi.ts` - Role management
- `fileApi.ts` - File operations
- `dashboardApi.ts` - Dashboard data

#### **State Management Architecture**

```
Frontend State Management:
├── React Query              # Server state & caching
│   ├── API data caching
│   ├── Background updates
│   └── Error handling
├── Zustand Stores          # Global client state
│   ├── AuthStore           # Authentication state
│   ├── DialogStore         # Modal management
│   ├── TrackerStore        # GPS tracking state
│   └── ForgotPasswordStore # Password recovery
└── React Hook Form         # Form state management
```

---

## 🛠️ Backend Architecture

### Technology Stack

- **Framework**: Node.js with najm-api framework
- **Database**: SQL with repository pattern
- **Authentication**: JWT with role-based access control
- **Validation**: Multi-layer validation system
- **Internationalization**: Built-in translation support
- **Security**: Admin guards and input sanitization

### 🏗️ Backend Architecture Pattern

**4-Layer Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Controller Layer                         │
│  - HTTP Request Handling (@Controller, @Get, @Post)        │
│  - Route Management & Parameter Binding                    │
│  - Response Formatting & Error Handling                    │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                          │
│  - Business Logic Implementation                           │
│  - Cross-Module Validation & Integration                   │
│  - Data Processing & Transformation                        │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Repository Layer                         │
│  - Database Operations & Query Building                    │
│  - Data Mapping & ORM Integration                          │
│  - Transaction Management                                   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Validation Layer                         │
│  - Input Validation & Sanitization                        │
│  - Business Rule Enforcement                               │
│  - Data Integrity Checks                                   │
└─────────────────────────────────────────────────────────────┘
```

### 📋 Complete API Documentation

#### **Authentication & Session Management**

```http
POST   /auth/register             # Register new user account
POST   /auth/login               # Authenticate user login
GET    /auth/refresh             # Refresh JWT access tokens
GET    /auth/logout/:id          # User logout and session cleanup
GET    /auth/me                  # Get current user profile
POST   /auth/forgot-password     # Initiate password recovery
```

#### **User & Role Management**

```http
# User Management
GET    /users                    # List all system users
GET    /users/:id                # Get specific user details
GET    /users/email/:email       # Find user by email address
GET    /users/role/:userId       # Get user's assigned role
GET    /users/lang               # Get current language preference
POST   /users                    # Create new user account
PUT    /users/:id                # Update user information
DELETE /users/:id                # Delete user account
DELETE /users                    # Delete all users (admin)
POST   /users/assign/:userId/:roleId  # Assign role to user
DELETE /users/remove/:userId      # Remove role from user
POST   /users/lang/:language     # Update user language

# Role Management
GET    /roles                    # List all available roles
GET    /roles/:id                # Get specific role details
POST   /roles                    # Create new role
PUT    /roles/:id                # Update role permissions
DELETE /roles/:id                # Delete role
```

#### **Fields Management**

```http
# Core CRUD Operations
GET    /fields                    # List all agricultural fields
POST   /fields                    # Create new field entry
GET    /fields/:id                # Get specific field details
PUT    /fields/:id                # Update field information
DELETE /fields/:id                # Remove field record
DELETE /fields                    # Delete all fields (admin)

# Field Analytics & Insights
GET    /fields/count              # Total field count
GET    /fields/total-area         # Total and average area statistics
GET    /fields/by-size           # Fields sorted by size
GET    /fields/large             # Large fields (>10 hectares)
GET    /fields/small             # Small fields (<5 hectares)
GET    /fields/active-operations  # Fields with ongoing operations
GET    /fields/name/:name         # Find field by name
GET    /fields/:id/operations     # Complete field operation history
GET    /fields/:id/statistics     # Field performance analytics
GET    /fields/:id/utilization    # Field utilization metrics
POST   /fields/seed               # Seed demonstration data
```

#### **Vehicle Fleet Management**

```http
# Core Fleet Operations
GET    /vehicles                  # Complete fleet inventory
POST   /vehicles                  # Register new vehicle
GET    /vehicles/:id              # Detailed vehicle information
PUT    /vehicles/:id              # Update vehicle details
PUT    /vehicles/:id/status       # Update vehicle status
DELETE /vehicles/:id              # Remove vehicle from fleet
DELETE /vehicles                  # Delete all vehicles (admin)

# Fleet Filtering & Lookup
GET    /vehicles/count            # Total vehicle count
GET    /vehicles/types            # Available vehicle types
GET    /vehicles/by-type/:type    # Filter vehicles by type
GET    /vehicles/active           # Currently active vehicles
GET    /vehicles/maintenance      # Vehicles requiring maintenance
GET    /vehicles/serial/:serialNumber    # Find by serial number
GET    /vehicles/license/:licensePlate   # Find by license plate

# Advanced Fleet Analytics
GET    /vehicles/analytics/in-use           # Vehicles currently operational
GET    /vehicles/analytics/status-distribution    # Fleet status breakdown
GET    /vehicles/analytics/type-distribution      # Vehicle type analysis
GET    /vehicles/analytics/age-analysis          # Fleet age distribution
GET    /vehicles/analytics/fuel-distribution     # Fuel type usage
GET    /vehicles/analytics/brand-analysis        # Brand performance analysis
GET    /vehicles/analytics/utilization           # Fleet utilization metrics
POST   /vehicles/seed             # Generate demo vehicle data
```

#### **Operations Lifecycle Management**

```http
# Core Operations Management
GET    /operations                # List all operations
POST   /operations                # Create new operation
GET    /operations/:id            # Operation details and status
PUT    /operations/:id            # Update operation parameters
DELETE /operations/:id            # Remove operation record
DELETE /operations                # Delete all operations (admin)

# Operation Lifecycle Control
PUT    /operations/:id/start      # Start operation execution
PUT    /operations/:id/complete   # Mark operation completed
PUT    /operations/:id/cancel     # Cancel scheduled operation
GET    /operations/:id/duration   # Calculate operation duration

# Operation Filtering & Analytics
GET    /operations/count          # Total operations count
GET    /operations/operation-types # Available operation types
GET    /operations/today          # Today's scheduled operations
GET    /operations/status/:status # Filter by operation status
GET    /operations/date/:date     # Operations by specific date
GET    /operations/vehicle/:vehicleId     # Vehicle operation history
GET    /operations/operator/:operatorId   # Operator assignment history
GET    /operations/field/:fieldId        # Field operation chronology
GET    /operations/type/:operationType    # Filter by operation type
```

#### **Operators & Workforce Management**

```http
# Core Operator Management
GET    /operators                 # List all operators
POST   /operators                 # Register new operator
GET    /operators/:id             # Operator profile and details
PUT    /operators/:id             # Update operator information
PUT    /operators/:id/status      # Update operator work status
DELETE /operators/:id             # Remove operator record
DELETE /operators                 # Delete all operators (admin)

# Operator Status & Compliance
GET    /operators/count           # Total operator count
GET    /operators/active          # Currently active operators
GET    /operators/inactive        # Inactive operator list
GET    /operators/suspended       # Suspended operators
GET    /operators/license-expiring # License expiration alerts
GET    /operators/license/:licenseNumber  # Find by license number

# Performance & History Analytics
GET    /operators/:id/operations  # Operator's complete operation history
GET    /operators/:id/performance # Performance metrics and ratings
POST   /operators/seed            # Generate demo operator data
```

#### **Fuel Management & Cost Analytics**

```http
# Core Fuel Recording
GET    /refuel                    # Complete fuel transaction history
POST   /refuel                    # Record new fuel transaction
GET    /refuel/:id                # Detailed transaction record
PUT    /refuel/:id                # Update transaction details
DELETE /refuel/:id                # Remove transaction record
DELETE /refuel                    # Delete all fuel records (admin)

# Fuel Data Filtering
GET    /refuel/count              # Total transaction count
GET    /refuel/recent             # Recent refueling activities
GET    /refuel/today              # Today's fuel transactions
GET    /refuel/date/:date         # Transactions by specific date
GET    /refuel/vehicle/:vehicleId # Vehicle-specific fuel history
GET    /refuel/operator/:operatorId # Operator refueling patterns
GET    /refuel/voucher/:voucherNumber # Find transaction by voucher

# Advanced Fuel Analytics
GET    /refuel/analytics/consumption      # Fleet consumption analysis
GET    /refuel/analytics/efficiency       # Fuel efficiency metrics
GET    /refuel/analytics/costs            # Comprehensive cost breakdown
GET    /refuel/analytics/summary          # Executive summary statistics
GET    /refuel/vehicle/:vehicleId/efficiency # Individual vehicle efficiency
GET    /refuel/vehicle/:vehicleId/costs   # Vehicle-specific cost analysis
GET    /refuel/trends/monthly             # Monthly consumption trends
```

#### **Vehicle GPS Tracking & Monitoring**

```http
# Core Tracker Management
GET    /trackers                  # List all GPS trackers
POST   /trackers                  # Register new tracking device
GET    /trackers/:id              # Tracker details and status
PUT    /trackers/:id              # Update tracker configuration
PUT    /trackers/:id/status       # Update tracker status
DELETE /trackers/:id              # Remove tracker device
DELETE /trackers                  # Delete all trackers (admin)

# Real-time Monitoring
GET    /trackers/count            # Total tracker count
GET    /trackers/online           # Currently online trackers
GET    /trackers/offline          # Offline tracker detection
GET    /trackers/status/:status   # Filter by connection status
GET    /trackers/vehicle/:vehicleId # Vehicle-specific tracker
GET    /trackers/device/:deviceId # Find tracker by device ID

# Bulk Fleet Operations
PUT    /trackers/bulk             # Bulk update multiple trackers
PUT    /trackers/offline/mark     # Mark inactive trackers offline
POST   /trackers/seed             # Generate demo tracking data
```

#### **File & Document Management**

```http
# Core File Operations
GET    /files                     # List all managed files
POST   /files                     # Upload new document/file
GET    /files/:id                 # File metadata and details
DELETE /files/:fileName           # Delete file by filename

# Advanced File Operations
GET    /files/path/:path          # Retrieve file by system path
GET    /files/entity/:entityType/:entityId # Files linked to entities
PUT    /files/entity/:id          # Update file entity associations
DELETE /files/path/:path          # Delete file by path
GET    /files/serve/:fileName     # Serve file content with headers
```

#### **Dashboard & Business Intelligence**

```http
# Dashboard Data Aggregation
GET    /dashboard/widgets         # Real-time dashboard KPI widgets
GET    /dashboard/operations/distribution # Operation type distribution

# System Analytics
GET    /roles                     # Available system roles
POST   /roles                     # Create custom roles
GET    /roles/:id                 # Role permissions and details
PUT    /roles/:id                 # Update role configuration
DELETE /roles/:id                 # Remove system role
```

---

## 🏗️ Frontend Component Architecture

### **Feature Components Pattern**

Each feature follows a consistent structure:

```typescript
Feature/
├── components/
│   ├── [Entity]Table.tsx     # Data table with CRUD operations
│   ├── [Entity]Form.tsx      # Create/edit forms
│   └── [Entity]Chart.tsx     # Data visualization components
├── hooks/
│   └── use[Entity].tsx       # Feature-specific data hooks
├── config/
│   ├── tableColumns.tsx      # Table configuration
│   ├── tableConfig.tsx       # Display settings
│   └── validateSchema.ts     # Form validation schemas
```

### **Shared Component Library**

#### **Data Tables (`NTable`)**

- Advanced sorting, filtering, and pagination
- Bulk selection and operations
- Responsive design with mobile optimization
- Export capabilities and data visualization

#### **Forms (`NForm`, `NDialogForm`)**

- React Hook Form integration with Zod validation
- Real-time validation and error display
- Modal and inline form variants
- Auto-save and draft management

#### **Status Management (`NStatusBadge`)**

- Dynamic status indicators with color coding
- Real-time status updates
- Hover tooltips with detailed information

#### **Navigation (`NSidebar`, `Nnavbar`)**

- Role-based navigation visibility
- Real-time notification indicators
- Multi-language menu support
- Responsive mobile navigation

### **State Management Strategy**

#### **Server State (React Query)**

- Automatic caching and synchronization
- Background data updates
- Optimistic UI updates
- Error boundary integration

#### **Global State (Zustand)**

- `AuthStore` - User authentication and permissions
- `DialogStore` - Modal and dialog management
- `TrackerStore` - GPS tracking and real-time updates
- `ForgotPasswordStore` - Password recovery workflow

### **Data Visualization Components**

#### **Dashboard Charts**

- Real-time KPI widgets with live updates
- Vehicle utilization and status distribution
- Operation performance and efficiency trends
- Fuel consumption analysis with cost breakdowns

#### **Feature-Specific Charts**

- Vehicle analytics (status, type, utilization, fuel distribution)
- Field productivity and utilization metrics
- Operator performance tracking and comparisons
- Fuel efficiency trends and cost analysis

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **Database**: PostgreSQL/MySQL
- **Package Manager**: npm/yarn/bun

### Frontend Development Setup

1. **Install Dependencies**
   
   ```bash
   cd dashboard
   npm install
   # or
   bun install
   ```

2. **Environment Configuration**
   
   ```bash
   cp .env.example .env
   # Configure API endpoints and authentication
   ```

3. **Start Development Server**
   
   ```bash
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

### Backend Development Setup

1. **Database Setup**
   
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

2. **Start Backend Server**
   
   ```bash
   npm run server:dev
   # API server runs on configured port
   ```

---

## 💼 Frontend Feature Overview

### **Dashboard Analytics**

- **Real-time Widgets**: Live KPIs for fuel, fields, vehicles, operations, operators
- **Interactive Charts**: Operation distribution, vehicle utilization, performance trends
- **GPS Tracking Map**: Real-time vehicle location monitoring

### **Resource Management Pages**

- **Fields Management**: Interactive table with area calculations, operation history, utilization analytics
- **Vehicle Fleet**: Comprehensive fleet management with status tracking, maintenance alerts, analytics charts
- **Operator Workforce**: Certification tracking, performance metrics, license expiration monitoring

### **Operations Control Center**

- **Operation Planning**: Multi-resource validation and scheduling
- **Lifecycle Management**: Real-time operation tracking from planned to completed
- **Performance Analytics**: Efficiency calculations and productivity insights

### **Financial Tracking**

- **Fuel Management**: Transaction recording with voucher tracking
- **Cost Analytics**: Vehicle-specific efficiency and cost analysis
- **Trend Analysis**: Monthly consumption patterns and budget forecasting

### **System Administration**

- **User Management**: Multi-role user administration with language preferences
- **Role Configuration**: Dynamic role creation and permission management
- **File Management**: Document upload, organization, and entity associations

---

## 🔄 Frontend-Backend Communication Flow

### **API Service Layer Pattern**

```typescript
// Example: Field API Service
export const getFieldsApi = async () => {
  const res = await api.get('/fields');
  return res.data;
};

export const createFieldApi = async (data: any) => {
  const res = await api.post('/fields', data);
  return res.data;
};
```

### **Feature Hook Integration**

```typescript
// Feature Hook using API services
export const useFields = () => {
  const crud = useEntityCRUD('fields', {
    getAll: fieldApi.getFieldsApi,
    create: fieldApi.createFieldApi,
    update: fieldApi.updateFieldApi,
    delete: fieldApi.deleteFieldApi,
  });

  return {
    fields: crud.data,
    createField: crud.useCreate(),
    updateField: crud.useUpdate(),
    deleteField: crud.useDelete(),
  };
};
```

### **Component Data Binding**

```typescript
// Table component using feature hook
const FieldsTable = () => {
  const { fields, createField, updateField, deleteField } = useFields();

  return (
    <NTable
      data={fields}
      onEdit={updateField}
      onDelete={deleteField}
      onCreate={createField}
    />
  );
};
```

---

## 📊 Advanced Features

### **Real-time Capabilities**

- Live GPS tracking with WebSocket integration
- Real-time operation status updates
- Automatic cache invalidation and UI synchronization
- Push notifications for critical alerts

### **Analytics & Reporting**

- Interactive data visualization with Recharts
- Exportable reports in multiple formats
- Predictive analytics for maintenance and costs
- Performance benchmarking across operations

### **Mobile Responsiveness**

- Fully responsive design with Tailwind CSS
- Touch-optimized interfaces for field use
- Offline capability for critical operations
- Progressive Web App (PWA) features

---

## 🛡️ Security & Performance

### **Frontend Security**

- JWT token management with automatic refresh
- Role-based component rendering
- Input sanitization and XSS protection
- Secure file upload with validation

### **Performance Optimization**

- React Query caching and background updates
- Component lazy loading and code splitting
- Image optimization and responsive assets
- Efficient re-rendering with React patterns

---

**Transform your agricultural operations with modern web technology and intelligent automation.** 

*Built for scalability, designed for usability, optimized for performance.*