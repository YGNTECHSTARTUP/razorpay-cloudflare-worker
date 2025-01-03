export type ErrorResponse = {
    error: {
      code: string;
      description: string;
      source: string;
      step: string;
      reason: string;
      metadata: object;
      field: string;
    };
  };
  
  export type StatusResponse = {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    offer_id: string | null;
    status: string;
    attempts: number;
    notes: any[];
    created_at: number;
  };
  export type PaymentResponse = ErrorResponse | StatusResponse;

  export async function fetchApiResponse(): Promise<PaymentResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    const random = Math.random();
  
    if (random < 0.5) {
      return {
        error: {
          code: "BAD_REQUEST_ERROR",
          description: "The amount must be atleast INR 1.00",
          source: "business",
          step: "payment_initiation",
          reason: "input_validation_failed",
          metadata: {},
          field: "amount",
        },
      };
    } else {
      return {
        id: "order_EKwxwAgItmmXdp",
        entity: "order",
        amount: 50000,
        amount_paid: 0,
        amount_due: 50000,
        currency: "INR",
        receipt: "receipt#1",
        offer_id: null,
        status: "created",
        attempts: 0,
        notes: [],
        created_at: 1582628071,
      };
    }
  }
  export const errstatus:ErrorResponse = {
    "error": {
      "code": "BAD_REQUEST_ERROR",
      "description": "The amount must be atleast INR 1.00",
      "source": "business",
      "step": "payment_initiation",
      "reason": "input_validation_failed",
      "metadata": {},
      "field": "amount"
    }
  }
  export const status:StatusResponse = {
    "id": "order_EKwxwAgItmmXdp",
    "entity": "order",
    "amount": 50000,
    "amount_paid": 0,
    "amount_due": 50000,
    "currency": "INR",
    "receipt": "receipt#1",
    "offer_id": null,
    "status": "created",
    "attempts": 0,
    "notes": [],
    "created_at": 1582628071
  }
  
  