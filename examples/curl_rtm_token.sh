curl -X POST http://localhost:3000/api/token/rtm \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "user_12345",
    "expireTime": 3600
  }'
