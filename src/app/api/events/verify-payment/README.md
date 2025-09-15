# Event Ticket Payment Verification API

This API endpoint handles the verification of event ticket payments after successful Paystack transactions.

## Endpoint
```
POST /api/events/verify-payment
```

## Request Body
```json
{
  "reference": "payment_reference_from_paystack"
}
```

## Response Format
### Success Response
```json
{
  "success": true,
  "purchase": {
    "id": "uuid",
    "event_id": "event_id",
    "customer_name": "Customer Name",
    "customer_email": "customer@example.com",
    "quantity": 1,
    "total_amount": 50,
    "payment_reference": "payment_reference_from_paystack",
    "status": "confirmed",
    "payment_status": "success",
    "verified_at": "2025-09-15T11:53:39.881+00:00",
    // ... other fields
  },
  "payment": {
    "status": "success",
    "reference": "payment_reference_from_paystack",
    "amount": 5000, // in kobo/cents
    "message": "Payment verified successfully"
  },
  "message": "Ticket purchase confirmed successfully"
}
```

### Error Response
```json
{
  "error": "Error description",
  "details": "Detailed error message",
  "code": "Error code (if available)",
  "hint": "Hint for resolving the error (if available)"
}
```

## Error Handling
The endpoint includes robust error handling with automatic fallback:
1. If setting the `verified_at` timestamp fails, it automatically retries without that field
2. Detailed error logging for debugging purposes
3. Proper HTTP status codes for different error scenarios

## Common Error Codes
- `400`: Missing payment reference
- `404`: Ticket purchase not found
- `500`: Database or server errors

## Testing
You can test this endpoint using:
```bash
curl -X POST "http://localhost:3000/api/events/verify-payment" \
  -H "Content-Type: application/json" \
  -d '{"reference":"your_payment_reference"}'
```