const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:Qwe12345@obgquickregister.m5a9bqx.mongodb.net/mydatabase?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));


const errorSchema = new mongoose.Schema({
  reason: String,
  errorMessage: String
});

const Error = mongoose.model('Error', errorSchema);

app.get('/errors', async (req, res) => {
  const errors = await Error.find();
  res.send(errors);
});

app.post('/errors', async (req, res) => {
    const error = new Error({
      reason: req.body.reason,
      errorMessage: req.body.errorMessage
    });
    await error.save();
    res.send(error);
});

app.delete('/errors/:id', async (req, res) => {
    const result = await Error.deleteOne({ _id: req.params.id });

    if (result.acknowledged === true) {
        const errors = await Error.find();
        res.send(errors);
    } else {
        response.status(404).send(new Error('Entry not found'));
    }
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => console.log('Server started on port '+ PORT));