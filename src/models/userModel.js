const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');
const { defaultImagePath } = require('../secret');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters!'],
    minlength: [3, 'Name cannot be less than 3 characters!'],
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (value) => {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minlength: [6, 'Name cannot be less than 6 characters!'],
    set: (value) => bcrypt.hashSync(value, bcrypt.genSaltSync(10)),
  },
  image: {
    type: String,
    default: defaultImagePath,
  },
  address: {
    type: String,
    required: [true, 'Address is required!'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required!'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBannded: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true});

const User = model('Users', userSchema);

module.exports = User;
