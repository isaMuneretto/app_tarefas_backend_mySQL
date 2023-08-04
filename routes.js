const express = require('express');
const router = express.Router();
const db = require("./sequelize");


//GET Retorna tarefas com paginação e ordenação
router.get('/tasks', async (req, res) => {
    const {page = 1 , limit = 10} = req.query;
    try {
        const [results, metadata] = await db.query(
            `SELECT * FROM tasks ORDER BY updatedAt DESC LIMIT :limit OFFSET :offset`,
            { 
                replacements: { limit: limit, offset: (page - 1) * limit },
                type: db.QueryTypes.SELECT
            }
        );
        res.json({
            tasks: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

//GET Consulta uma tarefa pelo ID
router.get('/tasks/:id', async (req, res) => {
    try {
        const [results, metadata] = await db.query(
            `SELECT * FROM tasks WHERE id = :id`,
            { 
                replacements: { id: req.params.id },
                type: db.QueryTypes.SELECT 
            }
        );
        if (results.length === 0){
            res.status(404).json({
                sucess: false,
                message:"tarefa não encontrada",
            });
        } else {
            res.json({
                sucess: true,
                task: results, //tirei o [0] após results pois não aparecia o id lá no postman
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

 //POST Cria uma tarefa
router.post('/tasks', async (req, res) => {
    
    db.query(`INSERT INTO tasks (description, createdAt, updatedAt) VALUES (?, ?, ?)`,
        { replacements: [req.body.description, new Date(), new Date()] }
    )
    .then(([results, metadata]) => {
        res.status(201).json({
            success: true,
            message: "Tarefa criada com sucesso",
            results: results,
        });
    }).catch((error) => {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    });
});

/*//POST Cria uma tarefa
router.post('/tasks', async (req, res) => {
    try {
        sequelize.query('INSERT INTO tasks (description, createdAt, updatedAt) VALUES (?, ?, 
        const [results, metadata] = await db.query(
            `INSERT INTO tasks (description) VALUES (:description)`,
            { 
                replacements: { description: req.body.description },
                type: db.QueryTypes.INSERT 
            }
        );
        res.status(201).json({
            sucess: true,
            message: "Tarefa criada com sucesso",
            results: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});
*/

router.put('/tasks/:id', async (req, res) => {
    try {
        const [results, metadata] = await db.query(
            `UPDATE tasks SET description = :description WHERE id = :id`,
            { 
                replacements: { id: req.params.id, description: req.body.description },
                type: db.QueryTypes.UPDATE 
            }
        );
        if (metadata.affectedRows === 0){
            res.status(404).json({
                sucess: false,
                message:"tarefa não encontrada",
            });
        } else {
            res.json({
                sucess: true,
                message: "Tarefa atualizada com sucesso",
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

//DELETE Deleta uma tarefa pelo ID
router.delete('/tasks/:id', async (req, res) => {
    try {
        const [results, metadata] = await db.query(
            `DELETE FROM tasks WHERE id = :id`,
            { 
                replacements: { id: req.params.id },
                type: db.QueryTypes.DELETE 
            }
        );
        if (results.length === 0){
            res.status(404).json({
                sucess: false,
                message:"tarefa não encontrada",
            });
        } else {
            res.json({//deleta mas não entra no true, entra no false
                sucess: true,
                message: "Tarefa deletada com sucesso",
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

module.exports = router;