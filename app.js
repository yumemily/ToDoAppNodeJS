// List all todo items: node app.js list
// List items by completion status: node app.js list --status=true/false
// Add a new to do item: node app.js add --todo='' --status=true/false
// Toggle a certain to-do item's status: node app.js toggle --id=id
// Delete a certain to do item: node app.js delete --id=id ex: --id=1
// Delete all items: node app.js delete_all


//To-do App:
//1. Read all the comands from terminal something like node app.js add todo
//2. Do something based on the commands (add,read todos)
//3. Store the data somewhere - need a json file to store the data
//why json? similar to mongodb which uses object data
//4. Functions to read/write the data

// import chalk from 'chalk';  using es6 pro: you can import just one piece con: you have to put it on top

//fs = file system
//fs.readfileSync(path[,options]) options is optional, path is required
const fs = require('fs');
const chalk = require('chalk'); //chalk library: terminal string styling
const yargs = require('yargs'); // use yargs to make our life easier

function loadData() { //read data from database
    const buffer = fs.readFileSync('./data/database.json') //reading the file from our system
    const data = buffer.toString(); //binary to string format but it's still a string!! gotta convert to JSON 
    // console.log(typeof JSON.parse(data)); 
    return JSON.parse(data) //parse string to a js object so you can load and push data later
}
loadData();

function deleteAll(){
    fs.writeFileSync('./data/database.json', JSON.stringify([]))
}

function updateData(data){
    fs.writeFileSync("data/database.json", JSON.stringify(data));
}

function saveData(todo) { //write data to database with fs.writeFileSync
    //new todo that you're passing in the function should be an object {todo: todoBody, status: toDoStatus} ex: {todo: 'eat lunch', status:'false'}
    let data = loadData(); //read existing data, expect to see a js array of todos
    data.push(todo) //get data, push the todo and then write the updated data to the database with fs.writeFileSync
    fs.writeFileSync('./data/database.json', JSON.stringify(data))
}

function addTodo(todoId, todoBody, todoStatus) {
    let data = loadData();
    if (data.length === 0) {
        todoId = 1;
    } else if (data.length > 0) {
        todoId = data[data.length - 1].id + 1;
    }
    saveData({ id: todoId, todo: todoBody, status: todoStatus })
}

function deleteTodo(todoId) {
    let data = loadData();
    var filteredtodos = data.filter((data) => data.id !== todoId);
    // deleteAll();
    fs.writeFileSync('./data/database.json', JSON.stringify(filteredtodos))
}

//without yargs
// console.log(process.argv) //an array with 2 elements: the path to node, the absolute path to your file 
// [2] will be the action like 'list' or 'add' and [3][4] is for adding new to do function 'eat lunch' false
// if(process.argv[2] === 'add'){
//     // console.log(process.argv[3], process.argv[4])
//     addTodo(process.argv[3], process.argv[4])
// }else if(process.argv[2] === 'list'){
//     const todos = loadData();
//     for(let { todo, status} of todos){
//         console.log((chalk.bold.blue(todo, status)))
//     }
// }

//Add New To-Do Item
yargs.command({
    command: "add",
    describe: "add some todo",
    builder: {
        id: {
            describe: 'id of the todo',
            demandOption: false, //is it required or not? 
            type: 'integer',
        },
        todo: {
            describe: 'content of the todo',
            demandOption: true, //is it required or not? 
            type: 'string'
        },
        status: {
            describe: 'status of the todo',
            demandOption: false, //if it's not required, we need a default value
            default: false,
            type: 'boolean'
        }
    },
    handler: function ({ id, todo, status }) {
        addTodo(id, todo, status)
        // console.log(todo,status)
    }
})

//Delete To-Do Item with delete <id> command
yargs.command({
    command: "delete",
    describe: "delete some todo",
    builder: {
        id: {
            describe: 'id of the todo',
            demandOption: true, //is it required or not? 
            type: 'integer',
        }
    },
    handler: function ({ id }) {
        deleteTodo(id)
        // console.log(todo,status)
    }
})

//List all to-do items
yargs.command({
    command: 'list',
    describe: 'list todos',
    builder: {
        status: {
            describe: 'todo status',
            type: 'boolean',
            demandOption: false,
            default: 'all'
        }
    },
    handler: function (args) {
        const todos = loadData();
        console.log(chalk.bold.green('My To-Do List'))
        for (let { id, todo, status } of todos) {
            if (args.status === 'all') {
                if (status === false) {
                    console.log(chalk.bold.cyan('ID:',id, todo), chalk.bold.red(status))
                } else if (status === true) {
                    console.log(chalk.bold.cyan('ID:',id, todo), chalk.bold.green(status))
                }
            }
            else if (status === args.status)
                console.log(chalk.bold.blue('ID',id,todo, status))
        }
    }
})

//Toggle todo status
yargs.command({
    command: "toggle",
    describe: "toggle a certain to do item's status",
    builder: {
        id: {
            describe: 'id of the todo',
            demandOption: true, //is it required or not? 
            type: 'integer',
        }
    },
    handler: function ({ id }) {
        data = loadData();
        let toggleStatus = data.map((item)=>{
            if(item.id == id){
                item.status = !item.status;
                return item
                // console.log('Task:',id,'completed?:',item.status)
            }
            return item;
        })
        updateData(toggleStatus)
    }
})
//Delete all todos
yargs.command({
    command: 'delete_all',
    describe: 'delete all todos',
    handler: function () {
        deleteAll();
    }
})

yargs.parse();
