#!/usr/bin/env bash

BASE_URL="${1:-http://localhost:7071}"
COUNT="${2:-10}"

echo "Sending $COUNT requests to $BASE_URL/api/submitOrder"

for i in $(seq 1 "$COUNT"); do
  ORDER_ID="burst-$i-$(date +%s)"
  PAYLOAD="{\"orderId\":\"$ORDER_ID\",\"customer\":\"Burst Test User\",\"items\":[\"milk\",\"bread\"],\"storeId\":\"store-001\"}"

  echo "Request $i -> $ORDER_ID"
  curl -s -o /dev/null -w "HTTP %{http_code}\n" \
    -X POST "$BASE_URL/api/submitOrder" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD"
done
