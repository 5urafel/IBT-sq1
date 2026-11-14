# Campus Events API

A RESTful API built with **NestJS** and **TypeScript** that allows students to discover campus events, view event details, and manage sessions belonging to each event.

## Features

- Retrieve all campus events.
- Retrieve a single event by ID.
- Create new campus events.
- Update existing campus events.
- Delete campus events.
- Manage event sessions.
- Validate incoming request data using `class-validator` and `class-transformer`.
- Handle missing events using NestJS `NotFoundException`.
- Use an in-memory repository for storing event data.

## Technologies Used

- NestJS
- TypeScript
- Node.js
- class-validator
- class-transformer
- REST API

## Project Structure

```text
src/
├── events/
│   ├── dto/
│   │   └── event.dto.ts
│   ├── event.repository.ts
│   ├── events.controller.ts
│   ├── events.module.ts
│   ├── events.service.ts
│   ├── events.types.ts
│   └── seed-events.ts
├── app.controller.ts
├── app.module.ts
└── app.service.ts
```

## Installation

Clone the repository and navigate to the project directory.

```bash
npm install
```

Install validation dependencies:

```bash
npm install class-validator class-transformer
```

## Running the Application

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
```

Production mode:

```bash
npm run start:prod
```

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| GET    | `/events`     | Retrieve all events      |
| GET    | `/events/:id` | Retrieve an event by ID  |
| POST   | `/events`     | Create a new event       |
| PATCH  | `/events/:id` | Update an existing event |
| DELETE | `/events/:id` | Delete an event          |

## Example: Create an Event

**POST** `/events`

```json
{
  "title": "Technology Innovation Day",
  "description": "A campus technology event.",
  "location": "Main Campus Hall",
  "date": "2026-12-15",
  "organizer": "Computer Science Department",
  "sessions": [
    {
      "title": "Introduction to AI",
      "description": "An introduction to artificial intelligence.",
      "speaker": "John Doe",
      "startTime": "09:00",
      "endTime": "10:30"
    }
  ]
}
```

## Architecture

The application follows a modular architecture:

- **Controller:** Handles HTTP requests and responses.
- **Service:** Contains business logic and event operations.
- **Repository:** Handles event data storage and retrieval.
- **DTOs:** Validate incoming event and session data.
- **Module:** Organizes and connects the controller, service, and repository.

## Data Storage

The current implementation uses an in-memory `Map` through `InMemoryEventRepository`.

Seed events are loaded when the repository is initialized. Data is not permanently stored and will reset when the application restarts.

## Error Handling

The API uses NestJS exceptions to handle missing events.

- `404 Not Found` – Event does not exist.
- `400 Bad Request` – Invalid request data (when validation is enabled).

## License

This project is developed for educational purposes.

By: Surafel Destaw
