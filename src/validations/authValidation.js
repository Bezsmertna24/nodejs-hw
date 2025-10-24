import { celebrate, Joi, Segments } from 'celebrate';

// register
const registerUserSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email'
    }),
    password: Joi.string().min(8).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long'
    })
  })
});

// login
const loginUserSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  })
});


// request reset email
const requestResetEmailSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email'
    })
  })
});

const resetPasswordSchema = celebrate({
  [Segments.BODY]: Joi.object({
    token: Joi.string().required().messages({
      'string.empty': 'Token is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
    }),
  }),
});


export { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema };
