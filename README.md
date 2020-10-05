## Microservice template - ExpressJS & Firebase functions
> For easier local debugging and edge functionality.

To add a new endpoint, all you need to do is just go to /functions/src/handlers and add a new javascript file, the name doesn't matter.
Just name the function with the desired path name.
```javascript
module.exports = {
    some_endpoint: {
        type: ['post'], exec: async (req, res) =>
            res.status(200).send("I'm alive!").end()
    },
}
```
The express server will automatically pick up your function and register it in express route with the specified method.
To include more than one method use the following
`type: ['post']`  or use a single method via `type: 'post'`.