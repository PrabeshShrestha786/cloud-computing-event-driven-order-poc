#!/usr/bin/env bash

BASE_URL="${1:-http://localhost:7071}"

echo "=== Valid request ==="
curl -i -X POST "$BASE_URL/api/submitOrder" \
  -H "Content-Type: application/json" \
  --data @valid-order.json

echo
echo "=== Invalid request (missing orderId) ==="
curl -i -X POST "$BASE_URL/api/submitOrder" \
  -H "Content-Type: application/json" \
  --data @invalid-order-missing-orderid.json

echo
echo "=== Duplicate request (first send) ==="
curl -i -X POST "$BASE_URL/api/submitOrder" \
  -H "Content-Type: application/json" \
  --data @duplicate-order.json

echo
echo "=== Duplicate request (second send, same orderId) ==="
curl -i -X POST "$BASE_URL/api/submitOrder" \
  -H "Content-Type: application/json" \
  --data @duplicate-order.json
