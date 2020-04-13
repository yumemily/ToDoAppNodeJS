# ToDoAppNodeJS
* A command line interface(C.L.I.) todo app using Node.JS.
* This will help you run your first "server-side" JavaScript program.
* One of the key features of this application will be that it can save data to the local disk, so the app has persistence.

![todoapp](/todothumbnail.png)

* List all todo items:
 ```node app.js list```
* List items by completion status:
 ```node app.js list --status=true/false```
* Add a new to do item:
``` node app.js add --todo='' --status=true/false```
* Toggle a certain to-do item's status:
``` node app.js toggle --id=id```
* Delete a certain to do item:
```node app.js delete --id=id ```
* Delete all items:
```node app.js delete_all```
