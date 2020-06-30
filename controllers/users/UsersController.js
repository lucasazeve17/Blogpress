const User = require('../../models/user')
const Category = require('../../models/Category')
const bcrypt = require('bcryptjs')

module.exports = {
    index(req, res) {

        User.findAll().then((users)=>{
            
            res.render('admin/users',{users})
        })

    },
    new(req, res) {
        Category.findAll().then((categories) => {
            res.render('admin/users/create', { categories })
        })
    },
    create(req, res) {
        const { email, password } = req.body;


        User.findOne({
            where: {
                email:email
            }
        }).then((user) => {
            if (user == undefined  ) {

                let salt = bcrypt.genSaltSync(10)
                let hash = bcrypt.hashSync(password, salt)

                User.create({
                    email,
                    password: hash
                }).then(() => {
                    res.redirect('/')
                }).catch((err) => {
                    res.redirect('/')
                })
            } else {
                //implementar msg de erro
                res.send(`Esse email ja está sendo utilizado`)
            }
        })

    },
    
    login(req,res){
        res.render('admin/users/login')   

    },
    auth(req,res){
        const {email,password} = req.body

        User.findOne({where:{email}}).then(user =>{
            if(user != undefined){
                let passwordCorrect = bcrypt.compareSync(password, user.password)
                if(passwordCorrect){
                    req.session.user ={ 
                        id:user.id,
                        email:user.email
                    }
                    res.redirect('/admin/articles')
                }else{
                    res.redirect('/admin/login')
                }
            }else{

            }
        })
    },
    logout(req,res){
        req.session.user = undefined
        res.redirect('/admin/login')
    }
}