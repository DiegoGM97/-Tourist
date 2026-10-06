import { z } from "zod";

const loginSchema = z.object({
  correo: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo electrónico válido"),
  contrasena: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const registroSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  correo: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo electrónico válido"),
  contrasena: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const reviewSchema = z.object({
  comment: z
    .string()
    .min(1, "Escribe tu reseña")
    .min(10, "La reseña debe tener al menos 10 caracteres"),
  rating: z
    .number()
    .min(1, "Selecciona una calificación")
    .max(5, "Calificación máxima de 5"),
});

const reservaSchema = z
  .object({
    nombre: z
      .string()
      .min(1, "El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    correo: z
      .string()
      .min(1, "El correo es obligatorio")
      .email("Ingresa un correo electrónico válido"),
    telefono: z
      .string()
      .min(1, "El teléfono es obligatorio")
      .min(7, "El teléfono debe tener al menos 7 dígitos")
      .regex(/^\d+$/, "El teléfono solo debe contener números"),
    fechaEntrada: z.string().min(1, "Selecciona la fecha de entrada"),
    fechaSalida: z.string().min(1, "Selecciona la fecha de salida"),
    huespedes: z.string().min(1, "Selecciona la cantidad de huéspedes"),
  })
  .refine(
    (data) => {
      if (!data.fechaEntrada || !data.fechaSalida) return true;
      return new Date(data.fechaSalida) > new Date(data.fechaEntrada);
    },
    { message: "La fecha de salida debe ser posterior a la de entrada", path: ["fechaSalida"] }
  );

function validate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, errors: {} };
  const errors = {};
  result.error.issues.forEach((issue) => {
    if (!errors[issue.path[0]]) {
      errors[issue.path[0]] = issue.message;
    }
  });
  return { success: false, errors };
}

export { loginSchema, registroSchema, reviewSchema, reservaSchema, validate };
