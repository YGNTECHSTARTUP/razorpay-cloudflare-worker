
![api-architecture](https://raw.githubusercontent.com/YGNTECHSTARTUP/razor/refs/heads/main/api-architecture.png)
# 🌟 Hono.js + Drizzle ORM + NeonDB API Documentation

Welcome to the documentation for your **Hono.js** app powered by **Drizzle ORM** and **NeonDB**. This app is built to manage campaigns and payments with a clean and modular design. It supports features like creating, updating, fetching, and deleting campaigns, as well as payment management.

---

## 🚀 Features

- **Campaign Management**:
  - Create, update, delete, and fetch campaign details.
  - Aggregated stats like total funders and total raised amounts.

- **Payment Handling**:
  - Create payments for campaigns.
  - Fetch payment details by user ID.
  - Update payment records dynamically.

- **Database Integration**:
  - Leveraging **Drizzle ORM** for type-safe queries.
  - Using **NeonDB** for serverless PostgreSQL.

---

## 🛠️ Prerequisites

Ensure you have the following:

1. **Node.js** (v18+ recommended)
2. A **NeonDB** instance
3. Installed dependencies:
   ```bash
   npm install hono drizzle-orm/neon-http @neondatabase/serverless
   ```

---

## 📂 File Structure

- **`db/schema.ts`**: Defines `campaigns` and `paymentTable` schemas.
- **`constant.ts`**: External API simulation for fetching payment data.
- **`index.ts`**: Main application logic.

---

## 📝 API Endpoints

### Root Endpoint

#### `GET /`
**Description**: A simple greeting endpoint.

**Response**:
```json
{
  "message": "Hello! There are 2 Routes /payment?userid and /user:id"
}
```

---

### Campaign Management

#### `POST /create-campaign`
**Description**: Create a new campaign.

**Request Body**:
```json
{
  "campaignname": "Save the Forests",
  "description": "A campaign to protect endangered forests.",
  "targetamount": 10000,
  "days": 30
}
```

**Response**:
- **201**: Campaign created successfully.
- **400**: Validation or duplicate error.

---

#### `GET /campaign/:id`
**Description**: Fetch campaign details by ID.

**Response**:
```json
{
  "campaignInfo": {
    "campaignDetails": [...],
    "totalfunders": 10,
    "raisedfund": 5000
  }
}
```

---

#### `GET /showcampaigns`
**Description**: Fetch all campaigns with aggregated stats.

**Response**:
```json
[
  {
    "campaignId": 1,
    "campaignName": "Save the Forests",
    "totalFunderCount": 5,
    "totalRaisedAmount": 3000
  },
  ...
]
```

---

#### `PUT /update-campaign/:id`
**Description**: Update an existing campaign.

**Request Body**:
```json
{
  "campaignname": "New Name",
  "description": "Updated description.",
  "targetamount": 20000,
  "days": 40
}
```

**Response**:
- **200**: Campaign updated successfully.
- **404**: Campaign not found.

---

#### `DELETE /delete-campaign/:id`
**Description**: Delete a campaign by ID.

**Response**:
- **200**: Campaign deleted successfully.
- **404**: Campaign not found.

---

### Payment Management

#### `POST /create-payment`
**Description**: Create a new payment for a user.

**Request Body**:
```json
{
  "userid": 1,
  "amount": 1000,
  "username": "John Doe",
  "campaignsid": 1
}
```

**Response**:
- **201**: Payment created successfully.
- **400**: Validation error.

---

#### `GET /payment?userid=ID`
**Description**: Fetch and update payment details for a user.

**Response**:
- **200**: Payment updated successfully.
- **502**: API or database error.

---

#### `GET /user/:id`
**Description**: Get the total payment amount for a user.

**Response**:
```json
{
  "userid": 1,
  "amount": 5000
}
```

---

#### `GET /show`
**Description**: Fetch all payments.

**Response**:
```json
[
  {
    "id": 1,
    "userid": 3,
    "amount": 2000,
    "username": "Alice",
    "campaignsid": null
  },
  ...
]
```

---

## 🛡️ Middleware

The `app.use('*')` middleware ensures a database connection is established for every request. It retrieves the `DATABASE_URL` from the environment and initializes the Drizzle ORM instance.

---

## 🔗 External API Integration

The `fetchPayment` function simulates fetching payment data from an external API. It returns either payment data or an error.

---

## 🌐 Error Handling

- **400**: Bad request or validation error.
- **404**: Resource not found.
- **500**: Unexpected server error.
- **502**: Database or external API failure.

---

## ⚡ Example Usage

### Run the App
```bash
node index.ts
```

### Test the Endpoints
Use tools like **Postman** or **curl** to test the API. For example:
```bash
curl -X POST http://localhost:3000/create-campaign -H "Content-Type: application/json" -d '{"campaignname":"Save the Forests", "description":"Protect trees", "targetamount":10000, "days":30}'
```

---

## 💡 Highlights

- Type-safe queries with Drizzle ORM.
- Serverless PostgreSQL powered by NeonDB.
- Modular design for scalability.

---

Feel free to extend this app with more features. Happy coding! 🚀
```
npm install
npm run dev
npm run deploy
```
