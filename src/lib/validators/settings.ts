import * as z from "zod"

export const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  goals: z.string().max(1000, "Goals must be less than 1000 characters").optional(),
})

export const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
export type PasswordFormValues = z.infer<typeof passwordFormSchema>
export type NotificationFormValues = z.infer<typeof notificationFormSchema>
