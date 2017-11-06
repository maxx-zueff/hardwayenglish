# Routes

## Topics management

### Add topic (for admins)

```http
POST /add-topic
```

*Request*

```json
{
  "token" : "Esf24#rsaf...",
  "topic" : "New Topic"
}
```

*Successful Response*

```json
{
  "name" : "New Topic",
  "order" : 1
}
```

### Update topic (for admins)

```http
POST /up-topic
```

*Request*

```json
{
  "token" : "Esf24#rsaf...",
  "old_name" : "New Topic",
  "new_name" : "Update Topic"
}
```

*Successful Response*

```
{
  "name" : "Update Topic",
  "order" : 1
}
```

### Remove topic (for admins)

```http
POST /del-topic
```

*Request*

```json
{
  "token" : "Esf24#rsaf...",
  "topic" : "Topic Name"
}
```

*Successful Response*

```json
{
  "status" : true
}
```

## Rules management

### Add rule (for admins)

```http
POST /add-rule
```

*Request*

```json
{
  "token" : "Esf24#rsaf...",
  "name" : "New Rule",
  "content" : "md",
  "example" : ["md1", "md2"...],
  "topic" : "Topic Name"
}
```

*Successful Response*

```json
{
  "name" : "New Rule",
  "order" : 1
}
```

