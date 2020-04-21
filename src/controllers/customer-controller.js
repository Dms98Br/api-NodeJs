const User = require("../models/customers");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../configure/auth')
const repository = require('../repositories/customer-repository');
var fs = require("fs");

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}
function gerarJson(params = {}){
    
    fs.readFile('input.json', 'utf8', function(err, data) {
        if (err) {
                var dados = [];                
                dados.push({email: params.email , password: params.password})    
                fs.writeFile("input.json", JSON.stringify(dados), function (e) {
                console.log('complete');
                })
            return
         }
            let leaderboard;
            try {
                leaderboard = JSON.parse(data);
            } catch(err) {
                console.log("Error parsing input JSON", err);
                return;
            }
            leaderboard.push({email: params.email , password: params.password});

            // now write the data back to the file
            fs.writeFile('input.json', JSON.stringify(leaderboard), 'utf8', function() {
                if (err) {
                    console.log(err);
                    return;
                }                
            });
        });    
}
//Post
exports.post = async (req, res, next) => {
    
    try {
        const { email } = req.body;
        if (await User.findOne({ email }))
            return res.status(400).send({ message: 'E-mail já cadastrado '})
        else
            var user = await repository.create(req.body)            
            res.status(201).send({ message: 'Usuário criado com sucesso' });
            gerarJson(user);
    } catch (e) {
        res.status(400).send({ message: 'Erro ao cadastra usuário'});           
    }
};
//Login
exports.login = async (req, res, next) => {
    try {
        const{ email, password } = req.body;        
        const user = await User.findOne({ email }).select('+password');
        
        if(!user)
            return res.status(400).send({ error: 'Email inválido' });           
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Senha inválida' });
        
        else            
            res.status(201).send({ message: 'Login efetuado com sucesso' });
            gerarJson(user);
    } catch (e) {
        res.status(400).send({ message: 'Erro'});
    }
}
//Authenticate
exports.Authenticate = async(req, res) => {
    const{ email, password} = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if(!user)
        return res.status(400).send({ error: 'Usuário não encontrado' });
    
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Senha inválida' });
    
    user.password = undefined;
    res.send({ 
        user,
        token: generateToken({ id: user.id })
    });
};
//Get All
exports.get = async (req, res) => {
    try {
        var data = await repository.get();
        res.status(200).send({
            data: data,
            count: data.length
        });        
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição', 
            error: e
        });
    };
};
//FindById
exports.getById = async (req, res) => {
   try {
       var data = await repository.getById(req.params.id);
       res.status(200).send(data);
   } catch (e) {
       res.status(500).send({
           message: 'Falha ao processar sua requisição',
           error: e
       })
   }
};
//PUT
exports.update = async (req, res) => {
    try {
        var data = await repository.update(req.params.id, req.body)
        res.status(201).send({ message: 'Usuário foi atualizado'})
    } catch (e) {
        re.status(400).send({ message: 'Erro ao atualizar usuário',
        error: e})
    }
};
//#region Delete
//DELETE
exports.del = async(req, res) => {
    try {        
        if(! await User.findOne({_id: req.params.id}))
            {
                res.status(400).send({ message: 'Usário não encontrado'})
                return false
            }
        var data = await repository.del(req.params.id)
        res.status(200).send({ message: 'Usuário deletado com sucesso' })
    } catch (e) {
        res.status(400).send({ message: 'Erro ao remover usuário',
        error: e
        })
    }
};
//#endregion

