# Key Store API

NestJS/Fastify backend for a small digital-key store. Data is persisted as
JSON files and seed data is written at startup.

## Requirements and setup

- Node.js 20 or newer
- pnpm

From this directory:

```bash
pnpm install
pnpm run build
pnpm run start:dev
```

The server listens on `http://localhost:5555` by default. Set `PORT` to
change the port. The storage directory defaults to `server/storage`; set
`STORAGE_PATH` to use another directory.

## API

All request bodies are validated. Unknown properties are rejected.

### `GET /`

Returns the basic service greeting as plain text:

```text
Hello World!
```

### `GET /health`

Returns `{"status":"ok"}`.

### `GET /products`

Returns active and inactive product records. A seeded installation contains
the `KEY-CS2-PRIME` product.

### `GET /products/:sku`

Returns an active product, or `404` if the SKU does not exist or is inactive.

### `POST /orders/create`

Creates an order for an active product:

```json
{ "sku": "KEY-CS2-PRIME" }
```

The response contains the order ID, SKU, amount, currency, status, and
timestamps. Invalid or unknown fields return `400`; an unknown SKU returns
`404`.

### `GET /orders/:id`

Returns an order, or `404` when the ID is unknown.

### `POST /webhook/payment`

Accepts an idempotent payment event and processes it immediately:

```json
{
  "event_id": "payment-123",
  "order_id": "<order-id>",
  "status": "paid",
  "amount": 1290,
  "currency": "RUB",
  "created_at": "2026-01-01T12:00:00.000Z"
}
```

`status` must be `paid` or `failed`; `created_at` must be an ISO-8601
timestamp. A successful payment marks the order paid and starts key delivery before the
request completes.
Repeated `event_id` values are ignored safely. Payment events for missing
orders are stored but do not alter an order.

## Storage and concurrency

JSON files are stored under `storage/<collection>/<id>.json`. Writes use a
temporary file followed by rename, and inventory/payment operations use lock
files to prevent concurrent duplicate allocation. Missing collections are
treated as empty and are created automatically.

## Commands

```bash
pnpm run build       # compile
pnpm run start       # run compiled Nest app
pnpm run start:dev   # watch mode
pnpm run test        # unit tests
pnpm run test:e2e    # end-to-end tests
pnpm run lint        # ESLint (fix mode)
```
