const _ = require('lodash')


module.exports = function(router){
    router.get('*',function(req,res){
        res.status(400);
    });

    router.use('/contact-submit',(req,res) => {
        res.status(200).send('ok');
    })
};