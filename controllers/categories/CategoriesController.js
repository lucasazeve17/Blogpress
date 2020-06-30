const Category = require('../../models/Category')
const Article = require('../../models/Article')
const slugify = require('slugify')


module.exports = {
    index(req, res) {
        Category.findAll().then((categories) => {

            return res.render('admin/categories/index', { categories })
        })

    },
    new(req, res) {
        return res.render('admin/categories/new')
    },
    create(req, res) {
        const  title  = req.body.title
        console.log('esse '+ title , typeof title, title == undefined, title == null, title == '')
        
        if (title != '' || title != undefined) {
            Category.create({
                title,
                slug: slugify(title)
            }).then(() => {
                res.redirect("/admin/categories")
            })
        } else {
            return res.redirect('/admin/categories/new')
        }

        return
    },
    edit(req,res){
        const {id} = req.params

        if(isNaN(id)){
            res.redirect('/admin/categories')
        }

        Category.findByPk(id).then(category=>{
            if(category != undefined){
                res.render('admin/categories/edit',{category})
            }else{
                res.redirect('/admin/categories')
            }
        })


    },
    update(req,res){
        const {title,id} = req.body
        
        Category.update({title,slug:slugify(title)},{
            where:{
                id
            }
        }).then(()=>{
            res.redirect('/admin/categories')
        })

    }
    ,
    destroy(req, res) {
        const { id } = req.body
        if (id != undefined) {
            if (!isNaN(id)) {
                Article.findOne({raw:true,where:{
                    categoryId:id
                }}).then((article)=>{
                 
                    if( article == undefined){
                        Category.destroy({
                            where: {
                                id
                            }
                        }).then(() => {
                            return res.redirect('/admin/categories')
                        });
                    }else{
                        res.redirect('/admin/categories?error=true')
                    }
                })
                
            }else{
                res.redirect('/admin/categories')
            }

        }else{
            res.redirect('/admin/categories')

        }
    }


}