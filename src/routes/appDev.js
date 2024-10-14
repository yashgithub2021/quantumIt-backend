const Router = require('express')
const { Create, GetAllQueries } = require('../controllers/appDevForms.controller')

const router = Router()

router.route('/').post(Create).get(GetAllQueries)

module.exports = router