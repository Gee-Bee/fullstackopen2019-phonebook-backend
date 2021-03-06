const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);

console.log('connecting to MongoDB', process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error);
  });

const personSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3,
  },
  number: {
    type: String,
    match: [/(?=(.*\d){8,})/, 'must have at least 8 digits'],
  },
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);