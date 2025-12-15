const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

// Task routes
router.get('/', TaskController.getAllTasks);
router.get('/next-number', TaskController.getNextTaskNumber);
router.get('/:id', TaskController.getTaskById);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
