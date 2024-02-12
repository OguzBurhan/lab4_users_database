// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const User = require('./user.model'); // Ensure this path is correct

const app = express();
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/lab4_users_database')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route to insert user data from JSON file
app.post('/insert-users', async (req, res) => {
    try {
        const userData = JSON.parse(fs.readFileSync('UsersData.json', 'utf8'));
        for (const user of userData) {
            const newUser = new User(user);
            await newUser.save();
            console.log(`User ${newUser.username} inserted successfully.`);
        }
        res.send('All users have been inserted.');
    } catch (error) {
        console.error('Error during user insertion:', error);
        res.status(500).send(error.message);
    }
});

// Route to insert a single user from request body
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
