# Miele Laundry — Demo App

A demo laundry management application built with Angular 21. Users can log in, view their cycle history, and start new cycles on available machines. Admins can additionally add new machines with their own tariffs.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the mock API

This app uses [json-server](https://github.com/typicode/json-server) as a backend. There is no registration — user accounts must exist in the database before logging in.

Create a `db.json` file with at least one user:

```json
{
  "users": [
    { "id": "1", "username": "admin", "password": "admin", "role": "admin" },
    { "id": "2", "username": "user", "password": "user", "role": "user" }
  ],
  "devices": [],
  "tariffs": [],
  "cycles": []
}
```

Then run:

```bash
npx json-server db.json --port 3000
```

> The API must be running before starting the app.

### 3. Start the app

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Build

```bash
ng build
```

---

## Pages

**Home** — displays the authenticated user's cycle history. Clicking the invoice button opens a breakdown of the invoice lines.

**Machines** — lists all available machines grouped by type. Selecting a machine shows its assigned tariff. From here users can start a new cycle on any machine.

---

## Assumptions & Notes

- Authentication is intentionally basic: credentials are compared against the json-server database in plain text. This is a demo only and not suitable for production.
- Role-based access is enforced on the frontend only. Admins see an additional "Add Device" button on the Machines page.
- Cascade POST on device creation: adding a machine first creates the tariff, then the device. If the device POST fails, the tariff is automatically rolled back via a compensating DELETE call.
- The app uses `json-server` in place of a real backend. Relational integrity (e.g. foreign keys) is not enforced server-side.

---

## Optional Features

### Login page
A simple unsecure login form. A JWT-style auth flow was intentionally omitted in favour of a lightweight approach that fits the json-server setup.

### Add cycle
Authenticated users can start a new cycle directly from the Machines page by selecting a device and clicking the `+` button. A confirmation dialog appears before the cycle is created.

### Unit testing
The `MergePeriodPipe` — responsible for formatting cycle period display strings — is covered by unit tests.

To run tests:

```bash
ng test
```
