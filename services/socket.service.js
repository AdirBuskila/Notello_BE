// const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null

function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        console.log('New socket', socket.id)
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
        })
        socket.on('view board', boardId => {
            if (socket.view === boardId) return;
            if (socket.view) {
                socket.leave(socket.view)
            }
            socket.join(boardId)
            console.log(socket.id, 'joined to ', boardId)
            socket.view = boardId
        })
        socket.on('board-update', board => {
            // emits to all sockets:
            // gIo.emit('board-update', board)
            // emits only to sockets in the same room
            gIo.to(board._id).emit('board-update', board)
        })
    })
}


module.exports = {
    connectSockets,
}