import { object, string, z } from 'zod';

export const LoginSchema = object({
  email: string({
    required_error: 'Email requerido!',
  })
    .trim()
    .min(1, 'Email requerido!')
    .email('Email inválido!'),
  password: string({
    required_error: 'Contraseña requerida!',
  })
    .trim()
    .min(1, 'Contraseña requerida!')
    .min(8, 'La contraseña debe tener al menos 8 caracteres!'),
});

export const RegisterSchema = object({
  name: string({
    required_error: 'Nombre requerido!',
  })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres!')
    .max(50, 'El nombre no puede tener más de 50 caracteres!'),
  email: string({
    required_error: 'Email requerido!',
  })
    .trim()
    .min(1, 'Email requerido!')
    .email('Email inválido!'),
  password: string({
    required_error: 'Contraseña requerida!',
  })
    .trim()
    .min(1, 'Contraseña requerida!')
    .min(8, 'La contraseña debe tener al menos 8 caracteres!')
    .max(50, 'La contraseña no puede tener más de 50 caracteres!'),
  confirmPassword: string({
    required_error: 'Confirmación de contraseña requerida!',
  })
    .trim()
    .min(1, 'Confirmación de contraseña requerida!'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden!',
  path: ['confirmPassword'],
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
export type TRegisterSchema = z.infer<typeof RegisterSchema>;
