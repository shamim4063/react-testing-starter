import * as z from "zod";

export const productFormSchema = z.object({
  id: z.number().optional(),
  name: z.string()
        .min(1, "Name is required")
        .max(255)
        .transform((val) => val.trim()) // Trim leading and trailing whitespace
        .refine((val) => val !== '', { message: "Name cannot be empty or whitespace only" }),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price is required",
    })
    .min(1)
    .max(1000),
  categoryId: z.number({
    required_error: "Category is required",
  }),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
