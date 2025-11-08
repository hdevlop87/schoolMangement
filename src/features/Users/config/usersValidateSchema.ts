import { z } from 'zod'

export const usersValidationSchema = (t) => z.object({
    name: z.string().min(2, { message: t('users.validation.nameMinLength') }),
    email: z.string().email({ message: t('users.validation.emailInvalid') }),
    password: z.string().min(6, { message: t('users.validation.passwordMinLength') }),
    confirmPassword: z.string().min(6, { message: t('users.validation.passwordConfirmationRequired') }),
    roleId: z.string().min(1, { message: t('users.validation.roleRequired') }),
    image: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: t('users.validation.passwordsDoNotMatch'),
    path: ["confirmPassword"],
})

export const updateUsersValidationSchema = (t) => z.object({
    id: z.string().optional(),
    name: z.string().min(2, { message: t('users.validation.nameMinLength') }),
    email: z.string().email({ message: t('users.validation.emailInvalid') }),
    password: z.string().min(6, { message: t('users.validation.passwordMinLength') }).nullish(),
    confirmPassword: z.string().nullish(),
    roleId: z.string().min(1, { message: t('users.validation.roleRequired') }),
    image: z.any().optional(),
}).refine((data) => {
    if (!data.password && !data.confirmPassword) return true;
    if (!data.password || !data.confirmPassword) return false;
    return data.password === data.confirmPassword;
}, {
    message: t('users.validation.passwordsDoNotMatch'),
    path: ["confirmPassword"],
})

// Keep the old exports for backward compatibility until all references are updated
export const createUserSchema = usersValidationSchema;
export const updateUserSchema = updateUsersValidationSchema;