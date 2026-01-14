const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000

let nextUserId = 0;

let users = [
    { id: 0, email: 'JohnDose@gmail.com', pass: '123456' }
];

// GET by id
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// POST create
app.post('/users', (req, res) => {
    const { email, pass } = req.body;

    if (!email || !pass) {
        return res.status(400).json({ error: 'Please enter a valid email and password' });
    }

    const newUser = { id: nextUserId++, email, pass };
    users.push(newUser);

    console.log('User created:', JSON.stringify(newUser, null, 2));
    res.status(201).json(newUser);
});

// PUT update
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { newEmail, newPass } = req.body;

    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users[index] = {
        id: userId,
        email: newEmail,
        pass: newPass
    };

    console.log('User updated:', JSON.stringify(users[index], null, 2));
    res.json(users[index]);
});

// DELETE
app.delete('/users/:id', (req, res) => {
    const deleteId = parseInt(req.params.id);

    const index = users.findIndex(u => u.id === deleteId);
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users.splice(index, 1);

    console.log('Remaining users:', JSON.stringify(users, null, 2));

    res.json({
        message: `Item with ID: ${deleteId} deleted successfully`,
        remainingItems: users
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

