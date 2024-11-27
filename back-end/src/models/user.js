import { z } from 'zod';

const User = z.object({
  fullname: 
    z.string()
    .min(5, { message: 'O nome completo deve ter, no mínimo, 5 caracteres' })
    .includes(' ', { message: 'O nome deve conter um espaço entre o nome e o sobrenome' }),

  username: 
    z.string()
    .min(3, { message: 'O nome de usuário deve ter, no mínimo, 3 caracteres' })
    .max(20, { message: 'O nome de usuário deve ter, no máximo, 20 caracteres' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'O nome de usuário deve conter apenas letras, números e sublinhados' }),

  email: 
    z.string()
    .email({ message: 'E-mail inválido' }),

  password: 
    z.string()
    .min(8, { message: 'A senha deve ter, no mínimo, 8 caracteres' })
    .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula' })
    .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
    .regex(/[@$!%*?&]/, { message: 'A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)' }),

  is_admin: 
    z.boolean().default(false),
})

export default User
