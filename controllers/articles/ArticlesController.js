const Category = require('../../models/Category')
const Article = require('../../models/Article')
const slugify = require('slugify')


module.exports = {
    index(req, res) {
        Article.findAll({
            include:[{model:Category}]
        }).then((articles) => {
            return res.render('admin/articles/index', { articles })
        })

    },
    edit(req, res) {
        const { id } = req.params


            Article.findByPk(id,{include:[{model:Category}]}).then((article) => {
                if (article != undefined) {
                    Category.findAll().then((categories)=>{
                        res.render('admin/articles/edit', { article,categories })
                    })
                }
                else {
                    res.redirect('/admin/articles')
                }
            })

    },
    udpate(req, res) {
        const { title, body, id, category } = req.body

        Article.update({ title, slug: slugify(title), body, categoryId:category }, {
            where: {
                id
            }
        }).then(() => {
            res.redirect('/admin/articles')
        })

    }
    ,
    new(req, res) {
        Category.findAll().then((categories) => {
            return res.render('admin/articles/new', { categories })
        })

    },
    create(req, res) {
        const { title, body, category } = req.body
        console.log('olha só',title,body)
        if(title != '' || body != '' ){
            Article.create({
                title,
                slug: slugify(title),
                body,
                categoryId: category
            }).then(() => {
                res.redirect('/admin/articles')
            })
        }else{
            res.send('preencha todos os campos')
        }
        

    },
    destroy(req, res) {
        const { id } = req.body
        if (id != undefined && !isNaN(id)) {
            Article.destroy({
                where: {
                    id
                }
            }).then(() => {
                res.redirect('/admin/articles')
            })

        } else {
            res.redirect('/admin/articles')
        }
    },
    page(req,res){
        let {num} = req.params
        let offset = 0
        if(isNaN(num) || num ==1){
            offset = 0
        }else{
            offset = parseInt(num)*4-4
        }

        Article.findAndCountAll({
            limit: 4,
            offset: offset,
            order: [
                ['id', 'DESC']
            ]
        }).then((articles)=>{
            let next;
            if(offset + 4 >= articles.count){
                next=false
            }else{
                next=true
            }


            let results ={
                next,
                num:  parseInt(num),
                articles
            }

            Category.findAll().then((categories)=>{
                res.render('admin/articles/page',{results,categories})
            })

        })

    },

    


}
