import * as yup from 'yup';

const loginSchema = yup.object({
  email: yup.string().required('This field can not be empty').email('Invalid e-mail address'),
  password: yup.string().required('This field can not be empty'),
});

const registerSchema = yup.object({
  login: yup
    .string()
    .required('This field can not be empty')
    .min(2, 'Username is too short')
    .max(32, 'Username is too long'),
  email: yup.string().required('This field can not be empty').email('Invalid e-mail address'),
  password: yup
    .string()
    .required('This field can not be empty')
    .min(8, 'Password is too short')
    .max(32, 'Password cannot be longer than 32 characters'),
});

const publicationSchema = yup.object({
  title: yup.string().required('This field can not be empty'),
});

export default { loginSchema, registerSchema, publicationSchema };
