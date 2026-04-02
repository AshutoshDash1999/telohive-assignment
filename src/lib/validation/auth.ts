import { z, type ZodError } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z.email("Please enter a valid email address."),
    phone: z.string().trim().min(1, "Phone is required."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export type FormErrors<T extends Record<string, unknown>> = Partial<
  Record<Extract<keyof T, string> | "form", string>
>;

export function mapZodErrors<T extends Record<string, unknown>>(
  error: ZodError<T>,
): FormErrors<T> {
  const formErrors: FormErrors<T> = {};

  for (const issue of error.issues) {
    const [field] = issue.path;
    if (typeof field === "string") {
      formErrors[field as Extract<keyof T, string>] = issue.message;
      continue;
    }

    formErrors.form = issue.message;
  }

  return formErrors;
}
