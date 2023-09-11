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
  errorMessage: String,
  dateAdded: Date
});

const errorTypesSchema = new mongoose.Schema({
  errorTypes: [ 
    {
      errorType: String,
      count: Number
    }
  ]
});

const Error = mongoose.model('Error', errorSchema);
const ErrorType = mongoose.model('ErrorType', errorTypesSchema);


app.get('/errors', async (req, res) => {
  const errors = await Error.find();
  res.send(errors);
});

app.get('/errorTypes', async (req, res) => {
  const errorTypes = (await ErrorType.find()).map((type) => type.errorType);
  res.send(errorTypes);
});

app.post('/errors', async (req, res) => {
    const error = new Error({
      reason: req.body.reason,
      errorMessage: req.body.errorMessage,
      dateAdded: req.body.dateAdded
    });
    await error.save();
    res.send(error);
});

app.post('/errorTypes', async (req, res) => {
  const updateOperation = {
    $set: {
      errorTypes: req.body.errors
    },
  };

  updated = await ErrorType.findOneAndUpdate({}, updateOperation, { returnOriginal: false })

  await updated.save();
  res.send(updated);
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