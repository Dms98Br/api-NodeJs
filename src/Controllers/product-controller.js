'use strict'

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');

exports.get = async(req, res, next) =>{
    try{
    var data = await repository.get();
    res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição', error: e
        })        
    }
}

exports.getBySlug = async(req, res, next) =>{
    try{
        var data = await repository.getBySlug(req.params.slug)
        res.status(200).send(data);                
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',error: e
        })
    }
    
}

exports.getById = async(req, res, next) =>{
  try {
    var data = await repository.getById(req.params.id)
    
    res.status(200).send(data);
  }catch(e){
    res.status(500).send({
        message: 'Falha ao processar sua requisição',error: e
    }) 
  }
        
}

exports.getByTag = async(req, res, next) =>{
   try {
        var data = await repository.getByTag(req.params.tags)
        res.status(200).send(data);
   } catch (error) {
        res.status(400).send({
        message: 'Falha ao processar sua requisição',
        error: e
    }) 
   }
}

exports.post = async (req, res, next) =>{

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 1, 'O título deve conter pelo menos 1 caracteres');
    contract.hasMinLen(req.body.description, 1, 'O descrição deve conter pelo menos 1 caracteres');
    contract.hasMinLen(req.body.slug, 1, 'O slug deve conter pelo menos 1 caracteres');
    contract.hasMinLen(req.body.price, 1, 'O preço deve conter pelo menos 1 caracteres');
    contract.hasMinLen(req.body.tag, 1, 'O tags deve conter pelo menos 1 caracteres');
    
    //Se os dados forem inválidos
    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        console.log("teste")
        var data = await repository.create(req.body);
        res.status(201).send({ message: 'Produto cadastrado com sucesso'});    
    } catch (e) {
        
        res.status(400).send({ message: 'Erro ao cadastra produto',
        error: e});
    }
};

exports.put = async(req, res, next) =>{
   try {
       var data = await repository.update(req.params.id, req.body)
       res.status(200).send({ message: 'Produto atualizado com sucesso'});
   } catch (error) {
        res.status(400).send({ message: 'Erro ao atualizar produto',
        error: e,
        data: e});
   }
};

exports.delete = async(req, res, next) =>{
    try {
        var data = await repository.del(req.params.id)
        res.status(200).send({ message: 'Produto removido com sucesso'});
    } catch (error) {
        res.status(400).send({ message: 'Erro ao remover produto',
        data: e,
        error: e});
    }
};