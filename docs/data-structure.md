# Data Structure

Here's the design of the data structure used in the project.
It's not very complex. It's just a list of names and a flag to indicate whether the person is coming or not.

## Structure

```json
{
  "guests": [
    {
      "family": "John and Jane",
      "code": "jhon-jane",
      "confirmed": true,
      "members": [
        {
          "name": "John Doe",
          "is_coming": true
        },
        {
          "name": "Jane Doe",
          "is_coming": false
        }
      ]
    }
  ]
}
```
