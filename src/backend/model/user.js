const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
    const userData = req.body;
    console.log('New User:', userData);
    // Save to DB or process here
    res.status(200).json({ message: 'Registered successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
