'use strict'

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service')
const authService = require('../services/auth-service');

exports.post = async (req, res, next) =>{

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 1 caracteres');
    
    //Se os dados forem inválidos
    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }
    
    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ["user"]
        });
        emailService.send(req.body.email, 'Welcome to ProFinder', global.EMAIL_TMPL.replace('{0}', req.body.name));
        res.status(201).send({ message: 'Cliente cadstrado com sucesso'});    
    } catch (e) {
        res.status(500).send({ message: 'Erro ao cadastra cliente', error: e});
        console.log(e)
    }
};

exports.get = async(req, res, next) =>{
   try{
    var data = await repository.get();
    res.status(200).send(data);    
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição', error: e
        })        
    }
};

exports.authenticate = async (req, res, next) =>{
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });
        if(!customer){
            res.status(404).send({
                message: 'Usuário ou senha inválido'
            });
            return;
        }
        emailService.send(req.body.email, 'Welcome to ProFinder', global.EMAIL_TMPL.replace('{0}', req.body.name));
        
        const token = await authService.generateToken({
            id: customer.id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        })
        
        res.status(201).send({
            token: token,
            data:{
                email: customer.email,
                name: customer.name
            }
        });    
    } catch (e) {
        res.status(500).send({ message: 'Erro ao cadastra cliente', error: e});
        console.log(e)
    }
};

exports.refreshToken = async (req, res, next) =>{
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token']
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if(!customer){
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }
        const tokenData = await authService.generateToken({
            id: customer.id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        })
                
        res.status(201).send({
            token: token,
            data:{
                email: customer.email,
                name: customer.name
            }
        });    
    } catch (e) {
        res.status(500).send({ message: 'Erro ao cadastra cliente', error: e});
        console.log(e)
    }
};
