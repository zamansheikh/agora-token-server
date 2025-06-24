curl -X POST http://localhost:3000/api/token/rtc \
  -H "Content-Type: application/json" \
  -d '{
    "channelName": "test_channel",
    "uid": 12345,
    "role": "publisher",
    "expireTime": 3600
  }'
