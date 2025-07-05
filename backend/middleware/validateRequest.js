// backend/middleware/validateRequest.js
const Joi = require('joi');

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required().min(2).max(30),
    lastName: Joi.string().required().min(2).max(30),
    email: Joi.string()
      .required()
      .email()
      .pattern(/@iiit\.ac\.in$/)
      .message('Only IIIT email addresses are allowed'),
    password: Joi.string()
      .required()
      .min(6)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
      .message('Password must contain at least one letter, one number, and one special character'),
    age: Joi.number().required().min(16).max(100),
    contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateUser };