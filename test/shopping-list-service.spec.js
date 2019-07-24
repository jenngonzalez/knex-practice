// test the CRUD methods
// get, insert, update, delete shopping list items
// shopping list contains: id, name, price, date_added, checked, category
// category: Main, Snack, Lunch or Breakfast
const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List Service Object`, function() {
    let db
    let testList = [
        {
            id: 1,
            name: 'Tofurkey Kielbasa',
            price: '5.00',
            date_added: new Date('2019-07-20T16:28:32.615Z'),
            checked: true,
            category: 'Main'
        },
        {
            id: 2,
            name: 'Violife Cheddar',
            price: '6.00',
            date_added: new Date('2019-07-21T16:28:32.615Z'),
            checked: false,
            category: 'Lunch'
        },
        {
            id: 3,
            name: 'Silk Cashew Milk',
            price: '3.99',
            date_added: new Date('2019-07-23T16:28:32.615Z'),
            checked: true,
            category: 'Breakfast'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testList)
        })

        it('returns a list of items', () => {
            return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql(testList)
            })
        })
        it(`getById() finds an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testList[thirdId -1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added,
                        checked: thirdTestItem.checked,
                        category: thirdTestItem.category
                    })
                })
        })
        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testList.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'updated name',
                price: '10.00',
                date_added: new Date(),
                checked: true,
                category: 'Lunch'
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate, ...newItemData,
                    })
                })
        })
           
    })

    context(`Given 'shopping_list has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        
        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Test new title',
                price: '1.00',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Snack'
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category
                    })
                })
        })
    })
})