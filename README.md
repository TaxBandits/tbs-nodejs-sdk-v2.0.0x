## Overview

The **TaxBandits Node.js SDK 2.0.x** is a Node.js integration package for the **latest TaxBandits API V2.0.x and future supported releases**. It enables businesses to seamlessly integrate TaxBandits services into their applications and programmatically manage tax filing workflows.

This SDK provides:

- **Node.js Backend Server** — Express.js API wrapper that handles OAuth 2.0 authentication, request routing, and AWS S3 draft PDF proxying
- **React Frontend Client** — TypeScript + Vite dashboard with pre-built components for Business, Recipient, and Form management
- **Pre-built Modules** — Business (Payer), Recipient, Form 1099-NEC, Form 1099-MISC, and cross-form utility endpoints

> 🔗 **Full API Reference**: [TaxBandits Developer Docs 2.0.0](https://developer.taxbandits.com/docs/2.0.0/Business/Overview)

---

## Project Structure

```
tbs-nodejs-sdk-2.0.x/
├── client/                      # React + TypeScript frontend (Vite)
│   ├── src/
│   │   ├── api/client.ts        # Axios HTTP client wrapper
│   │   ├── services/            # Business, Recipient, 1099 service layers
│   │   ├── components/          # Pre-built UI components
│   │   └── types/index.ts       # TypeScript interfaces
│   ├── .env.example             # Client env template
│   └── package.json
├── server/                      # Node.js + Express backend
│   ├── routes/                  # API endpoint routers
│   ├── handlers/                # Request handler functions
│   ├── services/                # API, OAuth, and draft PDF services
│   ├── mapper/                  # Request/response data mappers
│   ├── utils/                   # HTTP client and constants
│   ├── .env.example             # Server env template
│   └── app.js
├── README.md                    # This file
```

---

## Available API Modules

### Authentication

| Method | Endpoint         | Description                           |
| ------ | ---------------- | ------------------------------------- |
| POST   | `/auth/gettoken` | Obtain JWT access token via OAuth 2.0 |

### Business Management

Manage payers/employers for whom you are filing tax forms.

| Method | Endpoint               | Description                                           |
| ------ | ---------------------- | ----------------------------------------------------- |
| POST   | `/business/create`     | Create a new business (returns `BusinessId`)          |
| GET    | `/business/get`        | Retrieve business by `BusinessId` or `PayerRef`       |
| PUT    | `/business/update`     | Update existing business details                      |
| GET    | `/business/list`       | Paginated list with filters (TIN, active, date range) |
| DELETE | `/business/delete`     | Delete business permanently                           |
| GET    | `/business/deactivate` | Temporarily deactivate a business                     |
| GET    | `/business/reactivate` | Reactivate a deactivated business                     |
| POST   | `/business/adddba`     | Add DBA (Doing Business As) names                     |
| PUT    | `/business/updatedba`  | Update DBA name/address                               |
| GET    | `/business/listdba`    | List all DBAs for a business                          |
| DELETE | `/business/deletedba`  | Remove a DBA from a business                          |

> 📘 **Read more**: [Business Endpoints Documentation](https://developer.taxbandits.com/docs/2.0.0/Business/Overview)

**Key Concepts:**

- **BusinessId** — Unique GUID generated on creation; use as primary reference
- **PayerRef** — Optional user-defined identifier (usable interchangeably with BusinessId)
- **TIN Format** — Supports PLAIN tax identification number formats
- **IsDefaultBusiness** — Auto-used flag when no specific business is referenced

### Recipient Management

Manage payees/recipients (contractors, vendors, etc.) for 1099 filings.

| Method | Endpoint                        | Description                                       |
| ------ | ------------------------------- | ------------------------------------------------- |
| POST   | `/recipient/create`             | Create a new recipient                            |
| GET    | `/recipient/get`                | Get recipient details by ID                       |
| PUT    | `/recipient/update`             | Update recipient information                      |
| GET    | `/recipient/list`               | Paginated list (filter by business, date, active) |
| DELETE | `/recipient/delete`             | Delete a recipient                                |
| GET    | `/recipient/deactivate`         | Deactivate recipient                              |
| GET    | `/recipient/reactivate`         | Reactivate recipient                              |
| POST   | `/recipient/assignrecipients`   | Assign recipients to a business                   |
| POST   | `/recipient/unassignrecipients` | Unassign recipients from a business               |
| POST   | `/recipient/adddba`             | Add recipient-level DBA names                     |
| PUT    | `/recipient/updatedba`          | Update recipient DBA                              |
| GET    | `/recipient/listdba`            | List recipient DBAs                               |
| DELETE | `/recipient/deletedba`          | Delete recipient DBA                              |

### Form 1099-NEC

Nonemployee Compensation reporting (contractors, freelancers).

| Method | Endpoint                    | Description                               |
| ------ | --------------------------- | ----------------------------------------- |
| POST   | `/form1099nec/create`       | Create and save 1099-NEC form records     |
| GET    | `/form1099nec/get`          | Retrieve saved 1099-NEC records           |
| PUT    | `/form1099nec/update`       | Update existing 1099-NEC records          |
| POST   | `/form1099nec/validateform` | Validate form data before creation/update |

**Key Fields:** NEC amount, Cash Tips, Federal Tax WH, EPP, State withholding & income, Direct Sales indicator.

### Form 1099-MISC

Miscellaneous Income reporting (rents, royalties, medical payments, etc.).

| Method | Endpoint                     | Description                               |
| ------ | ---------------------------- | ----------------------------------------- |
| POST   | `/form1099misc/create`       | Create and save 1099-MISC form records    |
| GET    | `/form1099misc/get`          | Retrieve saved 1099-MISC records          |
| PUT    | `/form1099misc/update`       | Update existing 1099-MISC records         |
| POST   | `/form1099misc/validateform` | Validate form data before creation/update |

**Key Fields:** Rents, Royalties, Other Income, Medical Payments, Gross Proceeds, Crop Insurance, Section 409A, Nonqualified Deferred Compensation.

### Form Utilities

Cross-form operations for 1099s (list, status, PDFs, transmit, delete).

| Method | Endpoint                       | Description                                             |
| ------ | ------------------------------ | ------------------------------------------------------- |
| POST   | `/form1099/list`               | Paginated list of forms (by tax year, business, status) |
| GET    | `/form1099/status`             | Get real-time federal/state/distribution status         |
| GET    | `/form1099/requestdraftpdfurl` | Request pre-transmission draft PDF                      |
| GET    | `/form1099/draftpdffile`       | Download draft PDF (S3 SSE-C proxy)                     |
| GET    | `/form1099/requestpdfurls`     | Get post-transmission PDF URLs (Copy B, C, 1, 2, D)     |
| DELETE | `/form1099/delete`             | Delete saved (untransmitted) form records               |
| POST   | `/form1099/transmit`           | E-file forms to IRS/SSA + state agencies                |
| GET    | `/form1099/statuslog`          | Full audit trail of all status transitions              |

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **TaxBandits API Credentials** (Client ID, Client Secret, User Token) — sign up at [TaxBandits Developer](https://sandbox.taxbandits.com/)
- **AWS S3 Credentials** (for draft PDF proxy — optional if using pre-built URLs only)

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd tbs-nodejs-sdk-2.0.x

# Install server dependencies
cd server
npm install

# Install client dependencies (new terminal)
cd ../client
npm install
```

### 2. Configure environment variables

Copy the `.env.example` files and add your credentials:

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

### 3. Start the stack

```bash
# Terminal 1 — Backend server (port 5062)
cd server
npm run dev

# Terminal 2 — Frontend client (port 3000)
cd client
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Environment Variables

### Server (`server/.env`)

| Variable              | Required | Description                                                            |
| --------------------- | -------- | ---------------------------------------------------------------------- |
| `PUBLIC_API_URL`      | ✅       | TaxBandits API base URL (e.g. `https://testapi.taxbandits.com/v2.0.0`) |
| `OAUTH_URL`           | ✅       | OAuth 2.0 token endpoint URL                                           |
| `OAUTH_CLIENT_ID`     | ✅       | Your TaxBandits Client ID                                              |
| `OAUTH_CLIENT_SECRET` | ✅       | Your TaxBandits Client Secret                                          |
| `OAUTH_USER_TOKEN`    | ✅       | Your TaxBandits User Token                                             |
| `S3_ACCESS_KEY`       | ⚠️       | AWS Access Key (required for draft PDF download proxy)                 |
| `S3_SECRET_KEY`       | ⚠️       | AWS Secret Key (required for draft PDF download proxy)                 |
| `S3_BUCKET_NAME`      | ⚠️       | S3 bucket name (e.g. `expressirsforms`)                                |
| `S3_BASE64_KEY`       | ⚠️       | Base64-encoded SSE-C encryption key for draft PDFs                     |
| `S3_REGION`           | ⚠️       | AWS region (e.g. `us-east-1`)                                          |

### Client (`client/.env`)

| Variable            | Required | Default                 | Description             |
| ------------------- | -------- | ----------------------- | ----------------------- |
| `VITE_API_BASE_URL` | ✅       | `http://localhost:5062` | Backend server base URL |

---

## Typical Workflow

1. **Authenticate** → Obtain JWT token via `POST /auth/gettoken`
2. **Create Business** → `POST /business/create` → store `BusinessId`
3. **Add Recipients** → `POST /recipient/create` → store `RecipientId`s
4. **Create Form** → `POST /form1099nec/create` (or 1099-MISC) with `BusinessId` + `RecipientId`
5. **Validate** (optional) → `POST /form1099nec/validateform` to check for errors before save
6. **Review Draft PDF** → `/form1099/requestdraftpdfurl` → download preview
7. **Transmit** → `POST /form1099/transmit` → e-file to IRS + state agencies
8. **Track Status** → `/form1099/status` or `/form1099/statuslog`
9. **Get PDFs** → `/form1099/requestpdfurls` → retrieve Copy B, C, 1, 2, D PDFs

---

## Documentation

- 🔗 [Official TaxBandits API 2.0.0 Docs](https://developer.taxbandits.com/docs/2.0.0/Business/Overview)
  - [Business Endpoints](https://developer.taxbandits.com/docs/2.0.0/Business/Overview)
  - [Form 1099-NEC](https://developer.taxbandits.com/docs/2.0.0/Form-1099-NEC/Overview)
  - [Form 1099-MISC](https://developer.taxbandits.com/docs/2.0.0/Form-1099-MISC/Overview)
- 📂 [Server README](./server/README.md) — Backend setup, routes, architecture
- 📂 [Client README](./client/README.md) — Frontend setup, components, service layer

---

## Tech Stack

| Layer         | Technology                                                       |
| ------------- | ---------------------------------------------------------------- |
| Backend       | Node.js, Express.js 5.x, Axios, JWT                              |
| Frontend      | React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, React Router 7 |
| Auth          | OAuth 2.0 Bearer tokens, JWT                                     |
| Storage       | AWS S3 (SSE-C encrypted draft PDF proxy)                         |
| UI Components | lucide-react (icons), motion (animations), date-fns              |

---

## License

Internal SDK for TaxBandits API integration.
