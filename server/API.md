## API

Base: `http://localhost:8080`

Auth
- Route: POST `/api/v1/auth/signup`
- Payload: `{ "email", "password" }`
- Response: `{ "token", "user" }`

- Route: GET `/api/v1/profile` (Bearer token)
- Payload: none
- Response: `{ "user": { "id", "email", "role", "name", "createdAt" } }`

- Route: POST `/api/v1/auth/signin`
- Payload: `{ "email", "password", "role" }`
- Response: `{ "token", "user" }`

Reports
- Route: POST `/api/v1/reports`
- Payload: `{ "name", "location" | ("latitude","longitude"), "date", "mapArea", "leaderId", "photoUrl", "comment?" }`
- Response: `{ "report": { "id" } }`

- Route: GET `/api/v1/reports` (leader, Bearer token)
- Payload: none
- Response: `{ "reports": [...] }`

- Route: PATCH `/api/v1/reports/:id` (leader, Bearer token)
- Payload: `{ "status?": "awaiting|in_progress|resolved", "progress?": 0-100 }`
- Response: `{ "report": { "id", "status", "progress" } }`

- Route: DELETE `/api/v1/reports/:id` (leader owner or admin)
- Payload: none
- Response: `{ "deleted": true }`

Water Tests
- Route: POST `/api/v1/water-tests` (asha or admin)
- Payload: `{ "waterbodyName", "waterbodyId?", "dateTime", "location" | ("latitude","longitude"), "photoUrl", "notes", "quality" }`
- Response: `{ "waterTest": { "id" } }`

- Route: PATCH `/api/v1/water-tests/:id` (owner ASHA or admin)
- Payload: partial fields
- Response: `{ "waterTest": { "id" } }`

- Route: DELETE `/api/v1/water-tests/:id` (owner ASHA or admin)
- Payload: none
- Response: `{ "deleted": true }`

- Route: GET `/api/v1/water-tests/all` (admin)
- Payload: none
- Response: `{ "waterTests": [...] }`

Hotspots
- Route: GET `/api/v1/hotspots`
- Payload: none
- Response: `{ "hotspots": [...] }`

- Route: GET `/api/v1/hotspots/:id`
- Payload: none
- Response: `{ "hotspot": { ... } }`

- Route: POST `/api/v1/hotspots` (admin/leader)
- Payload: `{ "name", "description?", "location" | ("latitude","longitude") }`
- Response: `{ "hotspot": { "id" } }`

- Route: PATCH `/api/v1/hotspots/:id` (admin or creator leader)
- Payload: partial fields
- Response: `{ "hotspot": { "id" } }`

- Route: DELETE `/api/v1/hotspots/:id` (admin or creator leader)
- Payload: none
- Response: `{ "deleted": true }`

Chat
- Route: POST `/api/v1/chat` (Bearer token)
- Payload: `{ "message", "context?" }`
- Response: `{ "reply", "echo" }`

Gamified
- Route: GET `/api/v1/gamified/playbooks`
- Payload: none
- Response: `{ "playbooks": [...] }`

- Route: POST `/api/v1/gamified/playbooks` (Bearer token)
- Payload: `{ "title", "content", "source?": "local|llm" }`
- Response: `{ "playbook": { "id" } }`

- Route: PUT `/api/v1/gamified/playbooks/:id` (Bearer token)
- Payload: partial fields
- Response: `{ "playbook": { "id" } }`

- Route: DELETE `/api/v1/gamified/playbooks/:id` (Bearer token)
- Payload: none
- Response: `{ "deleted": true }`

- Route: GET `/api/v1/gamified/stories`
- Payload: none
- Response: `{ "stories": [...] }`

- Route: POST `/api/v1/gamified/stories` (Bearer token)
- Payload: `{ "title", "content", "source?": "local|llm" }`
- Response: `{ "story": { "id" } }`

- Route: PUT `/api/v1/gamified/stories/:id` (Bearer token)
- Payload: partial fields
- Response: `{ "story": { "id" } }`

- Route: DELETE `/api/v1/gamified/stories/:id` (Bearer token)
- Payload: none
- Response: `{ "deleted": true }`

- Route: GET `/api/v1/gamified/testimonials`
- Payload: none
- Response: `{ "testimonials": [...] }`

- Route: POST `/api/v1/gamified/testimonials` (Bearer token)
- Payload: `{ "content", "authorName?" }`
- Response: `{ "testimonial": { "id" } }`

- Route: PUT `/api/v1/gamified/testimonials/:id` (Bearer token)
- Payload: partial fields
- Response: `{ "testimonial": { "id" } }`

- Route: DELETE `/api/v1/gamified/testimonials/:id` (Bearer token)
- Payload: none
- Response: `{ "deleted": true }`

Admin
- Route: POST `/api/v1/admin/users` (admin)
- Payload: `{ "email", "password", "role", "name?" }`
- Response: `{ "user": { "id", "email", "role" } }`

- Route: GET `/api/v1/admin/users` (admin, filters: role, email, q, limit, cursor)
- Payload: none
- Response: `{ "users": [...], "nextCursor": "..." }`

- Route: GET `/api/v1/admin/users/:id` (admin)
- Payload: none
- Response: `{ "user": { ... } }`

- Route: GET `/api/v1/admin/reports` (admin)
- Payload: none
- Response: `{ "reports": [...] }`

- Route: GET `/api/v1/admin/water-tests` (admin)
- Payload: none
- Response: `{ "waterTests": [...] }`


