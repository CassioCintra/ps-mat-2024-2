import { Prisma } from '@prisma/client'
import prisma from '../database/client.js'
import Car from '../models/car.js'
import { z } from 'zod'

const controller = {} //Objeto vazio

controller.create = async function (req,res) {
    try{
        //Preenche qual usuário criou o carro com o id do usuário autenticado
        req.body.created_user_id = req.authUser.id

        //Preenche qual usuário modificou por último o carro com o id do usuário autenticado
        req.body.updated_user_id = req.authUser.id

        await prisma.car.create({data: Car.parse(req.body)})

        //HTTP 201: Created
        res.status(201).end()
    }
    catch(error){
        console.error(error)

        // HTTP 400 para erros de validação no Zod        
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Erro na validação",
                errors: error.errors,
            })
        }

        //HTTP 500: Internal server error
        res.status(500).end()
    }
}

controller.retriveAll = async function (req, res) {
    try {
        const includedRels = req.query.include?.split(',') ?? []

        const result = await prisma.car.findMany({
            orderBy: [{ model: 'asc' }, { brand: 'asc' }, { id: 'asc' }],
            include: {
                customer: req.query.includedRels === ('customer'),
                created_user: req.query.includedRels === ('created_user'),
                updated_user: req.query.includedRels === ('updated_user')
            }
        })
        res.send(result).end()
    } catch (error) {
        console.error(error)
        res.status(500).end()
    }
}


controller.retriveOne = async function(req, res) {
    try{
        const includedRels = req.query.include?.split(',') ?? []

        const result = await prisma.car.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                customer: req.query.includedRels === 'car',
                created_user: req.query.includedRels === 'created_user',
                updated_user: req.query.includedRels === 'updated_user'
            }
        })

        //Encontrou -> retorna HTTP 200: OK (implícito)
        if(result) res.send(result).end()
        //Não Encontrou -> retorna HTTP 404: Not Found
        else res.status(404).end()
    }
    catch(error){
        console.error(error)

        //HTTP 500: Internal Server Error
        res.status(500).end()
    } 
}

controller.update = async function(req,res) {
    try{
        req.body.updated_user_id = req.authUser.id

        const result = await prisma.car.update({
            where: {id: Number(req.params.id)},
            data: Car.partial().parse(req.body)
        })

        //Encontrou e atualizou -> HTTP 204: No Content
        if(result) res.status(204).end()
        //Não encontrou(e não atualizou) -> HTTP 404: Not Found
        else res.status(404).end() 
    }
    catch(error){
        console.error(error)

        // HTTP 400 para erros de validação no Zod        
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Erro na validação",
                errors: error.errors,
            })
        }

        //HTTP 500: Internal Server Error
        res.status(500).end()
    }
}

controller.delete = async function(req,res){
    try{
        const result = await prisma.car.delete({
            where: {id: Number(req.params.id)}
        })

        //Encontrou e excluiu -> HTTP 204: No Content
        res.status(204).end()
    }    
    catch(error){
        if(error?.code === 'P2025'){
            //Não encontrou e não excluiu -> HTTP 404: Not Found
            res.status(404).end()
        }
        else{
            console.error(error)

            // HTTP 500 -> Internal Server Error
            res.status(500).end()
        }
    }
}

export default controller