const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId




async function query() {
    try {
        const criteria = {}
            // await _buildCriteria(filterBy)
        const collection = await dbService.getCollection('board')
        const boards = await collection.find(criteria).toArray() || []
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = collection.findOne({ '_id': ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ '_id': ObjectId(boardId) })
        return boardId
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    newBoard = {
        "_id": ObjectId(),
        "title": board.title,
        "createdAt": new Date().getTime(),
        "createdBy": board.createdBy,
        "style": board.style,
        labels: [{
                "_id": ObjectId(),
                name: 'QA',
                bgc: '#F5DD29'
            },
            {
                "_id": ObjectId(),
                name: 'Done',
                bgc: '#ff9f1a'
            },
            {
                "_id": ObjectId(),
                name: 'Important',
                bgc: '#eb5a46'
            },
            {
                "_id": ObjectId(),
                name: 'Todo',
                bgc: '#c377e0'
            },

            {
                "_id": ObjectId(),
                name: 'Development',
                bgc: '#6EC2A9'
            },
            {
                "_id": ObjectId(),
                name: 'Critical',
                bgc: '#29CCE5'
            }
        ],
        "members": [board.createdBy],
        "groups": [],
        "activities": []
    }
    try {
        const collection = await dbService.getCollection('board')
        collection.insertOne(newBoard)
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}
async function update(board) {
    try {
        var id = ObjectId(board._id)
        delete board._id
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ "_id": id }, { $set: {...board } })
        return board
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

function getLabels() {
    return Promise.resolve(gLabels.map((label) => ({
        label,
        value: label.replaceAll(' ', '').toLowerCase(),
    })))
}

// function _buildCriteria({ filterBy }) {
//     filterBy = JSON.parse(filterBy)
//     const { inStock, labels, name } = filterBy;
//     const criteria = {}
//     if (name) {
//         criteria.name = { $regex: name, $options: 'i' }
//     }
//     if (inStock === 'instock') {
//         criteria.inStock = true
//     } else if (inStock === 'outofstock') {
//         criteria.inStock = false
//     }

//     if (labels.length > 0) {
//         filterBy.labels = filterBy.labels.map((filterLabel) => (
//             filterLabel.value
//         ))
//         criteria.labels = { $all: filterBy.labels }
//     }
//     return criteria
// }


module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    getLabels
}