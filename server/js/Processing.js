// Asynchronous functions and processing techniques

function processArray(items, process, timeout) {
    var todo = items.concat();

    setTimeout(function() {
        process(todo.shift());
        if(todo.length > 0) {
            setTimeout(arguments.callee, ((timeout === undefined) ? 25 : timeout));
        }
    },((timeout === undefined) ? 25 : timeout));
}
