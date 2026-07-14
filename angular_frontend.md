# Angular 21 Enterprise Frontend for MicroFinance Management System

This documentation represents a professional-grade standalone frontend dashboard built on **Angular 21** designed to pair with a **Spring Boot 3.5.3** microservices backend (interfaced via API Gateway on port `8080`).

The code is fully implemented in the directory: [angular_frontend/](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend).

---

## 📂 Project Directory Structure

```
angular_frontend/
├── angular.json
├── package.json
├── tsconfig.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    └── app/
        ├── app.component.ts
        ├── app.routes.ts
        ├── core/
        │   ├── guards/
        │   │   └── auth.guard.ts
        │   ├── interceptors/
        │   │   └── auth.interceptor.ts
        │   └── services/
        │       ├── auth.service.ts
        │       └── client.service.ts
        └── features/
            ├── chat/
            │   └── chat.component.ts
            ├── client-edit/
            │   └── client-edit.component.ts
            ├── client-list/
            │   └── client-list.component.ts
            ├── dashboard/
            │   └── dashboard.component.ts
            ├── login/
            │   └── login.component.ts
            └── register/
                └── register.component.ts
```

---

## 🛠️ Configuration & Core Files

### 1. Workspace Configuration: `angular.json`
Specifies standard browser and server build options, asset pipelines, and global styling maps.
* Path: [angular_frontend/angular.json](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/angular.json)

### 2. Project Metadata & Dependencies: `package.json`
Declares the core dependencies on Angular 21 libraries, RxJS, and TypeScript.
* Path: [angular_frontend/package.json](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/package.json)

### 3. Application Bootstrapper: `main.ts`
Enables routing, routing input binding parameters (for `/edit/:clientNumber`), HTTP client with intercepted headers, and browser animations.
* Path: [angular_frontend/src/main.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/main.ts)

### 4. JWT Authorization Interceptor: `auth.interceptor.ts`
Appends local storage Bearer tokens to backend requests to pass Spring Security validation checks automatically.
* Path: [angular_frontend/src/app/core/interceptors/auth.interceptor.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/core/interceptors/auth.interceptor.ts)

---

## 🔒 Services & State Management

### 1. Authentication Service: `auth.service.ts`
Exposes reactive authentication state using **Angular Signals** (`_currentUser` and `_token`), eliminating boilerplate behavior-subject pipelines.
* Path: [angular_frontend/src/app/core/services/auth.service.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/core/services/auth.service.ts)

### 2. Client Operations Service: `client.service.ts`
Interfaces with the Spring Boot `/api/v1/clients` controller. Maps enums (`Gender`, `MaritalStatus`, `KycStatus`) and routes requests for CRUD and pagination.
* Path: [angular_frontend/src/app/core/services/client.service.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/core/services/client.service.ts)

---

## 🎨 Professional Styling Sheet: `styles.css`
A premium, dark-themed styling configuration built using Vanilla CSS custom properties. It handles glassmorphism blur layers, tables, inputs, button gradients, and micro-animations.
* Path: [angular_frontend/src/styles.css](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/styles.css)

---

## 📺 View Components & Templates

### 1. Layout Container Component: `app.component.ts`
Combines collapsible navigation grids, active route markers, user authorization state headers, and logout controls.
* Path: [angular_frontend/src/app/app.component.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/app.component.ts)

### 2. Login Component: `login.component.ts`
A login form utilizing form validations and responsive loaders.
* Path: [angular_frontend/src/app/features/login/login.component.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/features/login/login.component.ts)

### 3. Register Component: `register.component.ts`
Creates operator identities matching backend properties.
* Path: [angular_frontend/src/app/features/register/register.component.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/features/register/register.component.ts)

### 4. Interactive Dashboard: `dashboard.component.ts`
Displays core KPIs and renders custom, interactive SVG-based charts (Line & Bar charts) featuring gradient maps and hovering tooltip states.
* Path: [angular_frontend/src/app/features/dashboard/dashboard.component.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/features/dashboard/dashboard.component.ts)

### 5. Client Directory Grid: `client-list.component.ts`
Integrates search input debouncing, column sorting parameters, page length dropdowns, and pagination controls.
* Path: [angular_frontend/src/app/features/client-list/client-list.component.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/features/client-list/client-list.component.ts)

### 6. Client Update & Registry: `client-edit.component.ts`
Form managing customer registration and information updates. Contains input field checks for Aadhaar (12 digits) and PAN (`[A-Z]{5}[0-9]{4}[A-Z]{1}`) properties.
* Path: [angular_frontend/src/app/features/client-edit/client-edit.component.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/features/client-edit/client-edit.component.ts)

### 7. Support Chat Room: `chat.component.ts`
Simulates live message grids, typing sequences, suggestions chips, and dynamic automatic responses.
* Path: [angular_frontend/src/app/features/chat/chat.component.ts](file:///c:/Users/91630/Desktop/MicroFinance-Management-System/angular_frontend/src/app/features/chat/chat.component.ts)

---

## ⚡ Deployment & Startup

1. Run the Spring Boot gateway microservice (listening on port `8080`).
2. Open terminal inside the workspace:
   ```bash
   cd angular_frontend
   npm install
   npm start
   ```
3. Open your browser at: `http://localhost:4200`
