const knex = require('knex')
require('dotenv').config()

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})



// 1. Get all the items that contain text:
function searchForText(searchTerm) {
    knexInstance
        .select('id', 'name', 'price', 'category', 'checked', 'date_added')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

searchForText('acon')


// Get all items paginated:
function paginateProducts(pageNumber) {
    const productsPerPage = 6
    const offset = productsPerPage * (pageNumber - 1)
    knexInstance
        .select('id', 'name', 'price', 'category', 'checked', 'date_added')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

paginateProducts(2)

// Get all items added after date:
function getItemsAddedAfterDate(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'category', 'checked', 'date_added')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}

getItemsAddedAfterDate(10)


// Get the total cost for each category:
function getTotalCostPerCategory() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })

}

getTotalCostPerCategory()