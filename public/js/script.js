const forms = document.querySelectorAll('form')


forms.forEach(form=>{
    form.addEventListener('submit',(e)=>{
        
        e.preventDefault()
        const articleOrCategory = window.location.pathname == '/admin/articles'?  "este artigo": "esta categoria"

        
        let decision = confirm(`Você deseja deletar ${articleOrCategory}?`)
       
        if(decision){
            form.submit()
        }
    })
})
