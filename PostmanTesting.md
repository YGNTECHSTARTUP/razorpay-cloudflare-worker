
---

# Hono.js API Documentation

This is the complete guide for testing all API routes of the Hono.js application using Postman. It covers campaign management and payment management endpoints.

---

## 🚀 Base URL

```plaintext
http://localhost:3000
```

---

## 📚 Endpoints

### **1. Root Endpoint**

#### **GET `/`**
- **Description**: A simple greeting message.
- **Request**:
  ```plaintext
  GET http://localhost:3000/
  ```
- **Response**:
  ```json
  {
    "message": "Hello! Enter the Valid Api Endpoint"
  }
  ```

---

### **2. Campaign Management**

#### **POST `/create-campaign`**
- **Description**: Create a new campaign.
- **Request**:
  - **Method**: `POST`
  - **URL**: `http://localhost:3000/create-campaign`
  - **Headers**:
    ```
    Content-Type: application/json
    ```
  - **Body** (JSON):
    ```json
    {
      "campaignname": "Save the Forests",
      "description": "Protect the endangered forests",
      "targetamount": 10000,
      "days": 30
    }
    ```
- **Responses**:
  - **201**:
    ```json
    {
      "message": "Campaign created successfully",
      "status": 201
    }
    ```
  - **400**:
    ```json
    {
      "error": "All fields are required",
      "status": 400
    }
    ```

---

#### **GET `/campaign/:id`**
- **Description**: Fetch campaign details by ID.
- **Request**:
  ```plaintext
  GET http://localhost:3000/campaign/1
  ```
- **Response**:
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

#### **GET `/showcampaigns`**
- **Description**: Fetch all campaigns with aggregated stats.
- **Request**:
  ```plaintext
  GET http://localhost:3000/showcampaigns
  ```
- **Response**:
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

#### **PUT `/update-campaign/:id`**
- **Description**: Update an existing campaign.
- **Request**:
  - **Method**: `PUT`
  - **URL**: `http://localhost:3000/update-campaign/1`
  - **Headers**:
    ```
    Content-Type: application/json
    ```
  - **Body** (JSON):
    ```json
    {
      "campaignname": "Save the Rainforests",
      "description": "Updated campaign description",
      "targetamount": 20000,
      "days": 60
    }
    ```
- **Responses**:
  - **200**:
    ```json
    {
      "message": "Campaign updated successfully",
      "status": 200
    }
    ```
  - **404**:
    ```json
    {
      "error": "Campaign not found",
      "status": 404
    }
    ```

---

#### **DELETE `/delete-campaign/:id`**
- **Description**: Delete a campaign by ID.
- **Request**:
  ```plaintext
  DELETE http://localhost:3000/delete-campaign/1
  ```
- **Responses**:
  - **200**:
    ```json
    {
      "message": "Campaign deleted successfully",
      "status": 200
    }
    ```
  - **404**:
    ```json
    {
      "error": "Unable to delete. Campaign does not exist.",
      "status": 404
    }
    ```

---

### **3. Payment Management**

#### **POST `/create-payment`**
- **Description**: Create a new payment for a user.
- **Request**:
  - **Method**: `POST`
  - **URL**: `http://localhost:3000/create-payment`
  - **Headers**:
    ```
    Content-Type: application/json
    ```
  - **Body** (JSON):
    ```json
    {
      "userid": 1,
      "amount": 1000,
      "username": "John Doe",
      "campaignsid": 1
    }
    ```
- **Responses**:
  - **201**:
    ```json
    {
      "message": "Payment created successfully",
      "status": 201
    }
    ```
  - **400**:
    ```json
    {
      "error": "Missing required fields: 'userid' or 'amount'.",
      "status": 400
    }
    ```

---

#### **GET `/payment?userid=ID`**
- **Description**: Fetch and update payment details for a user.
- **Request**:
  ```plaintext
  GET http://localhost:3000/payment?userid=1
  ```
- **Responses**:
  - **200**:
    ```json
    {
      "status": "success",
      "message": "Payment updated successfully"
    }
    ```
  - **502**:
    ```json
    {
      "error": "An error occurred while fetching payment",
      "status": "error",
      "code": "502"
    }
    ```

---

#### **GET `/user/:id`**
- **Description**: Get the total payment amount for a user.
- **Request**:
  ```plaintext
  GET http://localhost:3000/user/1
  ```
- **Response**:
  ```json
  {
    "userid": 1,
    "amount": 5000
  }
  ```

---

#### **GET `/show`**
- **Description**: Fetch all payments.
- **Request**:
  ```plaintext
  GET http://localhost:3000/show
  ```
- **Response**:
  ```json
  [
    {
      "id": 1,
      "userid": 1,
      "amount": 1000,
      "username": "John Doe",
      "campaignsid": 1
    },
    ...
  ]
  ```

---

## 🛠️ Import to Postman

1. Open Postman.
2. Go to **File > Import**.
3. Use the following JSON to import this collection:

```json
{
  "info": {
    "name": "Hono.js API",
    "description": "Postman collection for testing Hono.js API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "/",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/"
      }
    },
    ...
  ]
}
```

4. Replace `{{baseUrl}}` with `http://localhost:3000`.
5. Start testing! 🎉

--- 

This README includes all endpoints, descriptions, example requests, and responses for seamless API testing.
