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


### Get allowed topics

```http
POST /get-topics
```

*Request*

```json
{
  "token" : "Esf24#rsaf...",
}
```

*Successful Response*

```json
[{
  "name" : "Topic Name",
  "allowed" : true
},
{
 "name" : "Another Topic",
 "allowed" : false
}]
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
  "example" : ["md1", "md2"],
  "topic" : "Topic Name"
}
```

*Successful Response*

```json
{
  "name" : "New Rule",
  "content" : "md",
  "example" : ["md1", "md2"],
  "order" : 1,
  "topic" : "Topic Name"
}
```

### Update rule (for admins)

```http
POST /del-rule
```

*Request*

```json
{
  "token" : "Esf24#rsaf...",           // REQUIRED!
  "name" : "New Rule",                 // REQUIRED!
  "topic" : "Topic Name",              // REQUIRED!
  "order" : 3,
  "content" : "md",
  "example" : ["md1", "md2"]
}
```

*Successful Response*

```json
{
  "name" : "New Rule",
  "content" : "md",
  "example" : ["md1", "md2"],
  "order" : 1,
  "topic" : "Topic Name"
}
```

### Remove rule (for admins)

```http
POST /up-rule
```

*Request*

```json
{
  "token" : "Esf24#rsaf...", 
  "topic" : "Topic Name",
  "rule"  : "Rule Name"
}
```

*Successful Response*

```json
{
  "status" : true
}
```

### Get allowed rules

```http
POST /get-rule
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
  "mistake" 5,
  "rules" : [
    {
      "name" : "First Rule",
      "content" : "md",
      "example" : ["md1", "md2"],
      "order" : 1,
      "topic" : "Topic Name"
    },
    {
      "name" : "Second Rule",
      "content" : "md",
      "example" : ["md1", "md2"],
      "order" : 2,
      "topic" : "Topic Name"
    }
  ]
}
```
