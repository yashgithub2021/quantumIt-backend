const router = require('express').Router()

const {
    getCategory,
    createCategory,
    deleteCategory
} = require('../controllers/categoryController')

router.get('/getCategories', getCategory)
router.post('/createCategory', createCategory)
router.delete('/:id', deleteCategory)

module.exports = router