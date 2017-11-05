# Routes

## Admin functionality

### Add Topic

```http
POST /add-topic
```

*Request*

```json
{
  "token": "Esf24#rsaf...",
  "topic": "New Topic"
}
```

*Successful Response*

```json
{
  "name" : "New Topic",
  "order": 1
}
```

