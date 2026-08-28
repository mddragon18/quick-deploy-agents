# API Contract

## `/agents` Endpoints

### `Agent` Type

```typescript
export interface Agent {
    readonly id: string;
    name: string;
    description?: string;
    readonly createdAt: Date;   // Dates are returned as a string of form "2026-08-18T11:53:30.829Z"
    updatedAt: Date;
}
```

---

### `GET /agents/`

Returns a JSON response whose contents is a collection of objects of type `Agent`.

**Status Code:** `200`

---

### `GET /agents/:id`

Returns a JSON response whose body is an object of type `Agent` (as described before).

**Status Code:** `200`

If the requested agent does not exist, the API throws an error whose JSON body has the shape:

```json
{
    "message": "Agent not found"
}
```

**Error Status Code:** `404`

---

### `POST /agents/`

A POST request used to create an agent of type `Agent`.

**Expected JSON body:**

```json
{
    "name": "agent_name",
    "description": ""
}
```

- `name` — required
- `description` — optional

Any additional fields will be ignored.

If the `name` field is missing, an error with the following structure is returned:

```json
{
    "message": "The request is missing one or more required fields.",
    "missing_fields": ["email"]
}
```

**Error Status Code:** `422 Unprocessable Entity`

Returns a JSON whose body has an object of type `Agent`.

**Status Code:** `201`

---

### `PATCH /agents/:id`

Used to update an agent, given an id of the agent.

**Expected JSON body:**

```json
{
    "name": "updated_name",
    "description": "updated_description"
}
```

To update only one of the values, leave out the other field; extra fields are ignored.

Returns a JSON whose body has an object of type `Agent`.

**Status Code:** `200`

If the agent does not exist:

```json
{
    "message": "Agent not found"
}
```

**Error Status Code:** `404`

If both fields are omitted: returns the full `Agent` without any modifications.

---

### `DELETE /agents/:id`

Deletes the agent whose id is specified.

Returns nothing in the body.

**Status Code:** `204`

If the agent does not exist:

```json
{
    "message": "Agent not found"
}
```

**Error Status Code:** `404`

---

## Planned `/conversation` Endpoints (Shallow Routing)

### What is a conversation?

A conversation is a collection of messages between the user and the agent.

**Structure of a message:**

```
{
    from: "user" | "agent",
    content: string
}
```

Any additional content will be added when AI agents are incorporated.

**Structure of a conversation:**

```
{
    id,
    agent_id,
    messages: [ /* message objects */ ]
}
```

---

### `POST /agents/:id/conversation`

Creates a new conversation.

Accepts a message from the user in the body of the POST. Returns the object of type `Conversation` to the client side, which will contain the id of the conversation.

The request should accept only the following JSON payload:

```json
{
    "from": "user",
    "content": "Content of the message to agent"
}
```

**Status Code:** `201` — the conversation object wrapped in JSON.

**Errors:**

- Required fields not present - Zod handles
- Agent id doesn't exist — `404`, NotFoundError (agent not found)
- Any other error — `500`

---

### `GET /conversations/:id/messages`

Fetches all the messages in the conversation. (Auth part later.)

**Response shape:**

```
{
    "messages": [
        {
            "from": "user" | "agent",
            "content": "..."
        }
    ]
}
```

**Errors:**

- No such conversation exists — `404`, NotFoundError

---

### `POST /conversations/:id/messages`

Adds a new message to the conversation, either from the agent or from the user.


**Errors:**

- Conversation must exist, otherwise — `404`, NotFoundError
- Message is empty or missing required fields — `422`, MalformedRequest error
- Content is of the wrong type — WrongTypeError (extends ValidationError, which extends AppError)

---

### `DELETE /conversations/:id`

Deletes a conversation.
