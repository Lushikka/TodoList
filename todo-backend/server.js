const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/todoApp')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log(error));

// schema
const todoSchema = new mongoose.Schema({
    title:{required: true, type: String

    },
    description: String
});

// model
const todoModel = mongoose.model('Todo', todoSchema);

// express app
const app = express();
app.use(express.json());
app.use(cors());   // Enable CORS for all routes

// create new todo
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;

    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// update todo by item
app.put('/todos/:id', async (req, res) => {

    try {const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo=await todoModel.findByIdAndUpdate(id, { title, description }, 
        {new: true}
    )
    if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(updatedTodo);
     
    
    } catch (error) {
        
        res.status(500).json({ error: error.message });
    }});

        //delete item
        app.delete('/todos/:id', async (req, res) => {
            try {
                const id = req.params.id;     
                const deletedTodo = await todoModel.findByIdAndDelete(id);
                if (!deletedTodo) {
                    return res.status(404).json({ message: 'Todo not found' });
                }
                res.json({ message: 'Todo deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
            



// start server
const port = 4000;
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});
