# API Contract

This document describes the current HTTP API. Request validation is performed
with Zod. Invalid request bodies return `400 Bad Request` with the Zod error
formatted by `zod-validation-error`.

Unknown fields in object request bodies are stripped before the request reaches
the controller.

## Common response rules

- Dates are serialized as ISO-8601 strings in JSON responses.
- Unknown failures return `500` with `{ "message": "Internal Server Error" }`.
- Missing resources return `404` with `{ "message": string }`.
- Validation failures return `400` in this shape:

```json
{
  "error": {
    "name": "ZodValidationError",
    "details": [
      {
        "path": ["field"],
        "message": "..."
      }
    ]
  }
}
```

The `details` entries are produced by Zod and may contain additional
diagnostic properties such as `code`, `expected`, `received`, `minimum`, or
`origin`.

## Health

### `GET /health/`

Returns:

```json
{
  "status": "ok",
  "uptime": 12.34
}
```

**Status:** `200`

## Agents

### Agent response

```json
{
  "id": "1",
  "name": "Agent One",
  "description": "",
  "createdAt": "2026-08-28T07:25:45.913Z",
  "updatedAt": "2026-08-28T07:25:45.913Z"
}
```

`name` is a string from 2 through 25 characters. `description` is a string
when supplied and is returned as an empty string when omitted during creation.

### `GET /agents/`

Returns an array of agent objects.

**Status:** `200`

### `GET /agents/:id`

Returns one agent object.

If the agent does not exist:

```json
{
  "message": "Agent not found"
}
```

**Success status:** `200`

**Missing-resource status:** `404`

### `POST /agents/`

Request body:

```json
{
  "name": "Agent One",
  "description": "Optional description"
}
```

`name` is required. `description` is optional. Additional fields are ignored.

Returns the created agent object.

**Success status:** `201`

**Validation status:** `400`

### `PATCH /agents/:id`

Request body may contain either or both mutable fields:

```json
{
  "name": "Updated Agent",
  "description": "Updated description"
}
```

Both fields may be omitted; an empty object leaves the agent values unchanged
apart from the service updating `updatedAt`. Additional fields are ignored.

Returns the updated agent object.

**Success status:** `200`

**Validation status:** `400`

**Missing-resource status:** `404`

### `DELETE /agents/:id`

Deletes the specified agent and returns no response body.

**Success status:** `204`

**Missing-resource status:** `404`

## Conversations

### Conversation response

```json
{
  "id": "1",
  "agentId": "1",
  "messages": [
    {
      "from": "user",
      "content": "Hello"
    }
  ]
}
```

### Message request

```json
{
  "from": "user",
  "content": "Hello"
}
```

`from` must be either `"user"` or `"agent"`. `content` must be a string
containing at least one character. Additional fields are ignored.

### `POST /agents/:agentId/conversation`

Creates a conversation for the specified agent with the supplied initial
message. The request is validated with `MessageSchema`.

Returns the created conversation object.

**Success status:** `201`

**Validation status:** `400`

**Missing-agent status:** `404`

### `GET /conversations/:id`

Returns the conversation's messages as an array:

```json
[
  {
    "from": "user",
    "content": "Hello"
  }
]
```

**Success status:** `200`

**Missing-conversation status:** `404`

### `POST /conversations/:id/messages`

Adds a message to the specified conversation. The request is validated with
`MessageSchema`.

The endpoint returns no response body.

**Success status:** `200`

**Validation status:** `400`

**Missing-conversation status:** `404`

### `DELETE /conversations/:id`

Deletes the specified conversation and returns no response body.

**Success status:** `204`

**Missing-conversation status:** `404`
