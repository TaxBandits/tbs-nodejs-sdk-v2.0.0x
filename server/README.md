## Overview

The **TaxBandits Server** is a Node.js + Express.js middleware layer that sits between your client application and the TaxBandits API. It handles:

- 🔐 **OAuth 2.0 Authentication** — Automatic JWS signing, JWT fetching, token caching (50 min TTL), and 401 auto-refresh
- 🚦 **API Routing** — RESTful endpoints for Business, Recipient, 1099-NEC, 1099-MISC, and cross-form utilities
- 🔁 **Request/Response Mappers** — Structured data transformation between client and TaxBandits schemas
- 📁 **AWS S3 SSE-C Proxy** — Direct draft PDF download from S3 using server-side encryption with customer-provided keys
- ⚠️ **Error Handling** — Standardized HTTP status handling (200, 3xx, 400, 404, 405, 5xx)

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **TaxBandits API Credentials** — Obtain from [TaxBandits Developer Console](https://sandbox.taxbandits.com/):
  - Client ID
  - Client Secret
  - User Token
- **AWS S3 Credentials** (optional, for draft PDF proxy only)
  - Access Key / Secret Key
  - Bucket name + region
  - Base64 SSE-C encryption key

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your TaxBandits and AWS values (see [Environment Variables](#environment-variables) below).

### 3. Run development server

```bash
npm run dev
```

Uses `nodemon` for auto-restart on file changes. The server starts on **http://localhost:5062** with CORS enabled for all origins.

### 4. Run in production

```bash
npm start
```

Starts with plain `node app.js` on port 5062. For production deployments, put behind a reverse proxy (Nginx, Caddy, ALB) with HTTPS.

---

## Environment Variables

All variables are loaded from `server/.env` via `dotenv` at startup (see [config.js](./config/config.js)).

| Variable              | Required | Example                                        | Description                                            |
| --------------------- | -------- | ---------------------------------------------- | ------------------------------------------------------ |
| `PUBLIC_API_URL`      | ✅       | `https://testapi.taxbandits.com/v2.0.0`       | TaxBandits 2.0.0 API base URL                          |
| `OAUTH_URL`           | ✅       | `https://testoauth.expressauth.net/v2`         | OAuth 2.0 token endpoint                               |
| `OAUTH_CLIENT_ID`     | ✅       | `<your-taxbandits-client-id>`                             | Your TaxBandits Client ID                              |
| `OAUTH_CLIENT_SECRET` | ✅       | `<your-taxbandits-client-secret>`                       | Your TaxBandits Client Secret                          |
| `OAUTH_USER_TOKEN`    | ✅       | `<your-taxbandits-user-token>`             | Your TaxBandits User Token                             |
| `S3_ACCESS_KEY`       | ⚠️       | `<your-aws-access-key>`                         | AWS Access Key (required for draft PDF download proxy) |
| `S3_SECRET_KEY`       | ⚠️       | `<your-aws-secret-key>`     | AWS Secret Key                                         |
| `S3_BUCKET_NAME`      | ⚠️       | `<your-s3-bucket-name>`                              | S3 bucket holding draft PDFs                           |
| `S3_BASE64_KEY`       | ⚠️       | `<your-base64-sse-c-key>` | Base64 SSE-C customer-provided encryption key          |
| `S3_REGION`           | ⚠️       | `us-east-1`                                    | AWS S3 region      

> 🔒 **Security Note**: Never commit `.env` to version control. It is listed in `.gitignore`.

---

## API Routes

All routes are mounted in [app.js](./app.js) and return JSON by default.

### 🔐 Authentication — `/auth/*`

| Method | Route            | Handler                                       | Description                                   |
| ------ | ---------------- | --------------------------------------------- | --------------------------------------------- |
| POST   | `/auth/gettoken` | [auth.handler.js](./handlers/auth.handler.js) | Manually fetch a fresh OAuth JWT access token |

---

### 🏢 Business (Payer) — `/business/*`

Router: [business.routes.js](./routes/business.routes.js) · Handler: [business.handler.js](./handlers/business.handler.js) · Mapper: [business.mapper.js](./mapper/business.mapper.js)

| Method | Route                  | Description                                                                                       |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------- |
| POST   | `/business/create`     | Create new business(es). Returns `BusinessId` for future references.                              |
| GET    | `/business/get`        | Get a business by `?businessid=` or `?payerref=`                                                  |
| PUT    | `/business/update`     | Update existing business details                                                                  |
| GET    | `/business/list`       | Paginated list. Query params: `page`, `pagesize`, `fromdate`, `todate`, `payername`, `last4digit` |
| DELETE | `/business/delete`     | Delete business(es) by `?businessids=` (comma-separated)                                          |
| GET    | `/business/deactivate` | Soft-deactivate by `?businessids=`                                                                |
| GET    | `/business/reactivate` | Reactivate deactivated businesses                                                                 |
| POST   | `/business/adddba`     | Add DBA (Doing Business As) name(s)                                                               |
| PUT    | `/business/updatedba`  | Update a DBA's name or address                                                                    |
| GET    | `/business/listdba`    | List DBAs for a business by `?businessid=`                                                        |
| DELETE | `/business/deletedba`  | Delete a DBA by `?businessid=` + `?dbaids=`                                                       |

> 📘 Reference: [Business Endpoints in Docs](https://developer.taxbandits.com/docs/2.0.0/Business/Overview)

---

### 👥 Recipient — `/recipient/*`

Router: [recipient.routes.js](./routes/recipient.routes.js) · Handler: [recipient.handler.js](./handlers/recipient.handler.js) · Mapper: [recipient.mapper.js](./mapper/recipient.mapper.js)

| Method | Route                           | Description                                                                                           |
| ------ | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| GET    | `/recipient/list`               | Paginated list. Query: `businessId`, `payerref`, `page`, `pagesize`, `fromdate`, `todate`, `isactive` |
| GET    | `/recipient/get`                | Get single recipient by `?recipientid=`                                                               |
| POST   | `/recipient/create`             | Create one or more recipients                                                                         |
| PUT    | `/recipient/update`             | Update recipient data                                                                                 |
| DELETE | `/recipient/delete`             | Delete recipient by `?recipientid=`                                                                   |
| GET    | `/recipient/deactivate`         | Soft-deactivate by `?recipientids=`                                                                   |
| GET    | `/recipient/reactivate`         | Reactivate recipient(s)                                                                               |
| POST   | `/recipient/assignrecipients`   | Bulk-assign recipients to a business                                                                  |
| POST   | `/recipient/unassignrecipients` | Unassign recipients from a business                                                                   |
| POST   | `/recipient/adddba`             | Add recipient-level DBA names                                                                         |
| PUT    | `/recipient/updatedba`          | Update recipient DBA                                                                                  |
| GET    | `/recipient/listdba`            | List DBAs for a recipient                                                                             |
| DELETE | `/recipient/deletedba`          | Delete recipient DBA                                                                                  |

---

### 📄 Form 1099-NEC — `/form1099nec/*`

Router: [form1099nec.routes.js](./routes/form1099nec.routes.js) · Handler: [form1099nec.handler.js](./handlers/form1099nec.handler.js) · Mapper: [form1099nec.mapper.js](./mapper/form1099nec.mapper.js)

| Method | Route                       | Description                                                    |
| ------ | --------------------------- | -------------------------------------------------------------- |
| POST   | `/form1099nec/create`       | Create one or more 1099-NEC returns (Nonemployee Compensation) |
| PUT    | `/form1099nec/update`       | Update saved 1099-NEC records before transmission              |
| GET    | `/form1099nec/get`          | Retrieve return data by `?RecordIds=` (comma-separated)        |
| POST   | `/form1099nec/validateform` | Validate form payload **without** saving to TaxBandits         |

---

### 🧾 Form 1099-MISC — `/form1099misc/*`

Router: [form1099misc.routes.js](./routes/form1099misc.routes.js) · Handler: [form1099misc.handler.js](./handlers/form1099misc.handler.js) · Mapper: [form1099misc.mapper.js](./mapper/form1099misc.mapper.js)

| Method | Route                        | Description                                                            |
| ------ | ---------------------------- | ---------------------------------------------------------------------- |
| POST   | `/form1099misc/create`       | Create one or more 1099-MISC returns (Rents, Royalties, Medical, etc.) |
| PUT    | `/form1099misc/update`       | Update saved 1099-MISC records                                         |
| GET    | `/form1099misc/get`          | Retrieve by `?RecordIds=`                                              |
| POST   | `/form1099misc/validateform` | Validate payload without persisting                                    |

---

### 🛠️ Form Utilities (1099) — `/form1099utility/*`

Router: [form1099Utility.routes.js](./routes/form1099Utility.routes.js) · Handler: [form1099Utility.handler.js](./handlers/form1099Utility.handler.js) · Mapper: [form1099Utility.mapper.js](./mapper/form1099Utility.mapper.js)

**Note**: Despite the route prefix, these utilities work for **both 1099 forms and W-2 forms**.

| Method | Route                          | Description                                                                                                                                  |
| ------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/form1099/list`               | Paginated cross-form list. Filter by `TaxYear`, `FormTypes`, `Business`, `Recipient`, `SubmissionId`, status, date range, `Page`, `PageSize` |
| GET    | `/form1099/status`             | Real-time federal + state + distribution status. Query: `SubmissionId`, `RecordIds`                                                          |
| GET    | `/form1099/requestdraftpdfurl` | Generate a pre-transmission draft PDF. Query: `RecordId` → returns signed S3 URL                                                             |
| GET    | `/form1099/draftpdffile`       | **Proxied download** — fetches and streams draft PDF from S3 using SSE-C. Query: `draftPdfUrl`                                               |
| GET    | `/form1099/requestpdfurls`     | Post-transmission PDF URLs (Copy B, C, 1, 2, D). Query: `SubmissionId`, `RecordId`                                                           |
| DELETE | `/form1099/delete`             | Remove saved (untransmitted) records. Query: `SubmissionId`, `RecordIds`                                                                     |
| POST   | `/form1099/transmit`           | E-file to IRS/SSA + state agencies. Body: `SubmissionId`, `RecordIds[]`                                                                      |
| GET    | `/form1099/statuslog`          | Full audit trail of all status transitions. Query: `RecordId`                                                                                |

---

## Architecture

### Layered Structure

```
server/
├── app.js                          # Express entry: mount routes, CORS, JSON parse
├── config/
│   └── config.js                   # Dotenv loader → typed config object
├── utils/
│   ├── httpClient.js               # axios instances (oauthClient, apiClient)
│   └── constants.js                # Shared constants
├── services/
│   ├── oauth.service.js            # JWS signing → JWT fetching + 50-min cache
│   ├── api.service.js              # callPostApi / callGetApi with 401 auto-retry
│   └── draftPdf.service.js         # AWS S3 GetObject with SSE-C (AES256)
├── handlers/                       # Per-route request handlers (thin layer)
│   ├── auth.handler.js
│   ├── business.handler.js
│   ├── recipient.handler.js
│   ├── form1099nec.handler.js
│   ├── form1099misc.handler.js
│   └── form1099Utility.handler.js
├── mapper/                         # Request/response schema transformations
│   ├── business.mapper.js
│   ├── recipient.mapper.js
│   ├── form1099nec.mapper.js
│   ├── form1099misc.mapper.js
│   └── form1099Utility.mapper.js
├── routes/                         # Express Router definitions
│   ├── auth.routes.js
│   ├── business.routes.js
│   ├── recipient.routes.js
│   ├── form1099nec.routes.js
│   ├── form1099misc.routes.js
│   └── form1099Utility.routes.js
├── package.json
├── .env.example
└── .env                            # Your local secrets (gitignored)
```

### Request Flow

```
 Client (React SPA)
      │ HTTP request
      ▼
 Express Route (routes/*.routes.js)
      │
      ▼
 Handler (handlers/*.handler.js)
      │ 1. Validates input
      │ 2. Calls mapper for request shaping
      │ 3. Calls api.service
      ▼
 api.service (callPostApi / callGetApi)
      │ 1. Gets JWT from oauth.service (cache hit → skip)
      │ 2. Adds Authorization header
      │ 3. Hits TaxBandits API via apiClient (axios)
      │ 4. On 401 → re-fetches JWT (force refresh) + retries
      ▼
 TaxBandits 2.0.0 API
      │ response
      ▼
 Handler returns JSON to client
```

### OAuth Flow (see [oauth.service.js](./services/oauth.service.js))

1. **JWS Signing** — Builds JWT payload with `iss` (Client ID), `sub` (Client ID), `aud` (User Token), `iat`, `scope` (default: `FullAccess`), `categories` (default: `["All"]`), then signs with `HS256` using Client Secret.
2. **Token Exchange** — Calls `GET {OAUTH_URL}/token` with `Authentication: <jws>` header → receives `AccessToken`.
3. **Caching** — Tokens stored in-process with 50-minute TTL (slightly under TaxBandits' 60-min expiry for safety). Cache keyed by `{scope, forms}` JSON.
4. **Auto-Refresh** — `api.service` catches HTTP 401 from TaxBandits → calls `getJwt(null, null, true)` to regenerate cache + retry the original request.

### Draft PDF Proxy (see [draftPdf.service.js](./services/draftPdf.service.js))

The `/form1099/draftpdffile` endpoint avoids exposing S3 credentials or SSE-C keys to the browser:

1. Client calls `requestdraftpdfurl` first → receives signed S3 path
2. Client passes that URL to `draftpdffile?draftPdfUrl=...`
3. Server parses the S3 key from the URL
4. Server calls AWS SDK `GetObjectCommand` with:
   - `SSECustomerAlgorithm: "AES256"`
   - `SSECustomerKey: <base64 from S3_BASE64_KEY>`
5. Server streams the decrypted bytes back with correct `Content-Type` header

---

## Port & CORS

- **Default Port**: `5062` (hardcoded in [app.js](./app.js#L22))
- **CORS**: Enabled for all origins via `cors()` (no restrictions). Tighten in production with origin whitelisting.
- **Body Limit**: Express default JSON parser (100KB)

---

## Scripts

| Script        | Command          | Use Case                                   |
| ------------- | ---------------- | ------------------------------------------ |
| `npm start`   | `node app.js`    | Production runtime (single process)        |
| `npm run dev` | `nodemon app.js` | Development — auto-restart on file changes |

---

## Troubleshooting

### Authentication 401

- Double-check `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `OAUTH_USER_TOKEN`
- Tokens are cached in-memory — restart the server to force cache reset

### Draft PDF 403 / Access Denied

- Verify S3 credentials, bucket region, and `S3_BASE64_KEY` match TaxBandits' SSE-C key
- Check that the IAM user has `s3:GetObject` permission on the target bucket/prefix

### Request Timeout

- `apiClient` has a 30-second timeout (see [httpClient.js](./utils/httpClient.js))
- OAuth has a 5-second timeout
- For production, consider increasing these behind a load balancer

### CORS Errors in Browser

- Ensure the server is reachable at the `VITE_API_BASE_URL` defined in the client
- Confirm the server process is running on port 5062

---

## Tech Stack Summary

| Component     | Library               |
| ------------- | --------------------- |
| Web Framework | Express.js 5.x        |
| HTTP Client   | Axios                 |
| Environment   | dotenv                |
| Auth / JWS    | jsonwebtoken (HS256)  |
| CORS          | cors                  |
| AWS SDK       | @aws-sdk/client-s3 v3 |
| Dev Server    | nodemon               |

---

## Next Steps

1. Configure `.env` with your TaxBandits credentials
2. Start server: `npm run dev`
3. Verify with a quick sanity test:
   ```bash
   curl -X POST http://localhost:5062/auth/gettoken
   ```
4. Start the frontend client (see [../client/README.md](../client/README.md))
5. Extend handlers/mappers to add custom business logic or new TaxBandits endpoints

---

📚 **Related Documentation**

- [Root SDK README](../README.md) — Full SDK overview, module summary, typical workflow
- [Client README](../client/README.md) — React dashboard setup & component library
- [Official TaxBandits API 2.0.0 Docs](https://developer.taxbandits.com/docs/2.0.0/Business/Overview)
  - [Business Overview](https://developer.taxbandits.com/docs/2.0.0/Business/Overview)
  - [Business Create](https://developer.taxbandits.com/docs/2.0.0/Business/Create)
