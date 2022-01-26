const fs = require('fs');
let toys = require('../data/toy.json')
const { makeId } = require('./util.service.js')




module.exports = {
    query,
    getById,
    remove,
    save,
    update,
    getLabels
}

const gLabels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']


const gToys = [{
        _id: makeId(),
        name: 'Talking Doll',
        price: 123,
        labels: ['Doll', 'Battery Powered', 'Baby'],
        inStock: true,
        createdAt: Date.parse(2018, 2, 12)
    },
    {
        _id: makeId(),
        name: 'bla bla',
        price: 14.5,
        labels: ['Battery Powered', 'Art', 'On wheels'],
        inStock: false,
        createdAt: Date.now()
    },
]


function query(filterBy) {
    let filteredToys
    if (!toys || toys.length === 0) {
        toys = gToys
        _savetoysToFile()
        return Promise.resolve(gToys)
    } else {
        filteredToys = _getFilteredToys(toys, filterBy) || []
        return Promise.resolve(filteredToys)
    }
}

function _getFilteredToys(filteredToys, { name, labels, inStock }) {
    if (name) filteredToys = filteredToys.filter(toy => toy.name.toLowerCase().includes(name.toLowerCase()))

    if (inStock === 'Out of stock') filteredToys = filteredToys.filter(toy => !toy.inStock)

    else if (inStock === 'In stock') filteredToys = filteredToys.filter(toy => toy.inStock)

    if (labels.length > 0) {
        filteredToys = filteredToys.filter(toy => labels.map((filterLabel) => (
            filterLabel.value
        )).every(filterLabel => toy.labels.map((label) => (
            label.replaceAll(' ', '').toLowerCase()
        )).includes(filterLabel)))
    }
    return filteredToys
}

function getById(toyId) {
    let toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject(`No such toy ${toyId}`)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const toy = toys.find(toy => toyId === toy._id);
    if (!toy) {
        throw new Error(`No such toy ${toyId}`)
    }
    toys = toys.filter(toy => toy._id !== toyId)
    return _savetoysToFile()
}

function update(toyToUpdate) {
    const toy = toys.find(toy => toy._id === toyToUpdate._id)
    if (!toy) {
        console.log('Toy Not Found');

    }
    toys = toys.map(toy => (toy._id === toyToUpdate._id) ? toyToUpdate : toy);
    return _savetoysToFile().then(() => toyToUpdate)
}


function save(toy) {
    toys.unshift(toy)
    return _savetoysToFile().then(() => toy)
}

function getLabels() {
    return Promise.resolve(gLabels.map((label) => ({
        label,
        value: label.replaceAll(' ', '').toLowerCase(),
    })))
}


function _savetoysToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/toy.json', JSON.stringify(toys, null, 2), (err) => {
            if (err) {
                console.log(err);
                reject('Cannot write to file')
            } else {
                console.log('Wrote Successfully!');
                resolve()
            }
        });
    })

}