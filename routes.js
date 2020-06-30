const express = require('express')
const routes = express.Router()
const CategoriesController = require('./controllers/categories/CategoriesController')
const ArticlesController = require('./controllers/articles/ArticlesController')
const UserController = require('./controllers/users/UsersController')
const Article = require('./models/Article')
const Category = require('./models/Category')
const adminAuth = require('./middlewares/adminAuthe')


routes.get('/', (req, res) => {

    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit:4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles, categories })
        })
    })
})

routes.get('/category/:id', (req, res) => {
    const {id} = req.params

    Article.findAll({
        where:{ 
            categoryId:id
        },
        limit:4
    }).then(articles=>{
        Category.findAll().then(categories=>{
            res.render('index',{articles,categories})
        })
    })

    
})

routes.get('/:slug', (req, res) => {
    const { slug } = req.params

    Article.findOne({
        where: {
            slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', { article, categories })
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

//Categories
routes.get('/admin/categories', adminAuth,CategoriesController.index)
routes.get('/admin/categories/edit/:id',adminAuth, CategoriesController.edit)
routes.get('/admin/categories/new', adminAuth,CategoriesController.new)
routes.delete('/admin/categories/',adminAuth, CategoriesController.destroy)
routes.post('/categories/save',adminAuth, CategoriesController.create)
routes.put('/categories/update',adminAuth ,CategoriesController.update)

//Articles

routes.get('/admin/articles',adminAuth, ArticlesController.index)
routes.get('/admin/articles/new',adminAuth ,ArticlesController.new)
routes.get('/admin/articles/edit/:id',adminAuth, ArticlesController.edit)
routes.get('/articles/page/:num',ArticlesController.page)
routes.post('/articles/save',adminAuth, ArticlesController.create)
routes.put('/articles/update', adminAuth,ArticlesController.udpate)
routes.delete('/articles/delete', adminAuth,ArticlesController.destroy)

//user
routes.get('/admin/users',adminAuth,UserController.index)
routes.get('/admin/users/create',UserController.new)
routes.post('/admin/users/create',UserController.create)
routes.get('/admin/login',UserController.login)
routes.post('/admin/authenticate',UserController.auth)
routes.get('/admin/logout',UserController.logout)





module.exports = routes