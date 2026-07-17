import { z } from 'zod';

// ============= ESQUEMAS DE VALIDACIÓN =============
// Estos esquemas coinciden con las reglas de validación del backend (Laravel)

// ============= PRODUCTO =============
export const productoSchema = z.object({
  num_serie: z.string()
    .min(1, 'El número de serie es obligatorio')
    .max(15, 'El número de serie no puede exceder los 15 caracteres')
    .regex(/^[A-Z0-9-]+$/, 'El número de serie solo puede contener mayúsculas, números y guiones'),
  
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras, números y espacios'),
  
  marca: z.string()
    .min(1, 'La marca es obligatoria')
    .max(50, 'La marca no puede exceder los 50 caracteres')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'La marca solo puede contener letras, números, espacios y guiones'),
  
  precio: z.string()
    .min(1, 'El precio es obligatorio')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.01 && num <= 99999.99;
    }, 'El precio debe estar entre 0.01 y 99,999.99')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'El precio debe ser mayor a 0'),
  
  stock_actual: z.string()
    .min(1, 'El stock actual es obligatorio')
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0 && num <= 999;
    }, 'El stock actual debe estar entre 0 y 999 unidades')
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && Number.isInteger(num);
    }, 'El stock actual debe ser un número entero'),
  
  stock_minimo: z.string()
    .min(1, 'El stock mínimo es obligatorio')
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 10 && num <= 999;
    }, 'El stock mínimo debe estar entre 10 y 999 unidades')
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && Number.isInteger(num);
    }, 'El stock mínimo debe ser un número entero'),
  
  id_proveedor: z.string()
    .min(1, 'Debe seleccionar un proveedor')
    .max(4, 'El ID de proveedor no es válido'),
  
  ubicacion: z.string()
    .max(4, 'La ubicación no puede exceder 4 caracteres')
    .optional(),
});

export const updateProductoSchema = productoSchema.partial();

// ============= VENTA =============
export const ventaSchema = z.object({
  nombre_cliente: z.string()
    .min(1, 'El nombre del cliente es requerido')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios permitidos'),
  
  dni_cliente: z.string()
    .min(1, 'El DNI es requerido')
    .length(8, 'El DNI debe tener exactamente 8 dígitos')
    .regex(/^\d{8}$/, 'El DNI debe contener solo números'),
  
  productos: z.array(z.object({
    id_producto: z.string()
      .min(1, 'El ID del producto es requerido')
      .max(4, 'ID de producto inválido'),
    
    cantidad: z.number()
      .int('La cantidad debe ser un número entero')
      .min(1, 'La cantidad mínima es 1')
      .max(100, 'La cantidad máxima por producto es 100'),
  }))
  .min(1, 'Debe haber al menos un producto')
  .max(999, 'No puede haber más de 999 productos en una transacción'),
});

// ============= PROVEEDOR =============
export const proveedorSchema = z.object({
  id_proveedor: z.string()
    .min(1, 'El ID es requerido')
    .max(4, 'El ID no puede exceder 4 caracteres'),
  
  razon_social: z.string()
    .min(1, 'La razón social es requerida')
    .max(50, 'La razón social no puede exceder 50 caracteres'),
  
  ruc: z.string()
    .min(1, 'El RUC es requerido')
    .length(11, 'El RUC debe tener exactamente 11 dígitos')
    .regex(/^\d{11}$/, 'El RUC debe contener solo números'),
  
  telefono: z.string()
    .min(1, 'El teléfono es requerido')
    .length(9, 'El teléfono debe tener exactamente 9 dígitos')
    .regex(/^\d{9}$/, 'El teléfono debe contener solo números'),
  
  correo: z.string()
    .min(1, 'El correo es requerido')
    .max(50, 'El correo no puede exceder 50 caracteres')
    .email('Formato de correo inválido'),
  
  direccion: z.string()
    .min(1, 'La dirección es requerida')
    .max(50, 'La dirección no puede exceder 50 caracteres'),
  
  estado: z.boolean().default(true),
});

export const updateProveedorSchema = proveedorSchema.partial();

// ============= LOGIN =============
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'El usuario es requerido')
    .max(50, 'El usuario no puede exceder 50 caracteres'),
  
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .max(255, 'La contraseña no puede exceder 255 caracteres'),
});

// ============= USUARIO (REGISTRO) =============
export const usuarioSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  
  apellido: z.string()
    .min(1, 'El apellido es requerido')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  
  username: z.string()
    .min(1, 'El usuario es requerido')
    .max(50, 'El usuario no puede exceder 50 caracteres'),
  
  correo: z.string()
    .min(1, 'El correo es requerido')
    .max(50, 'El correo no puede exceder 50 caracteres')
    .email('Formato de correo inválido'),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña no puede exceder 255 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)'
    ),
  
  id_rol: z.string()
    .min(1, 'El rol es requerido'),
});

// ============= ACTUALIZAR STOCK =============
export const actualizarStockSchema = z.object({
  actual: z.string()
    .min(1, 'El stock actual es requerido')
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0 && num <= 999;
    }, 'El stock debe estar entre 0 y 999'),
  
  ajuste: z.string()
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num);
    }, 'El ajuste debe ser un número válido'),
});

export const motivoAjusteSchema = z.object({
  motivo: z.string()
    .min(1, 'El motivo es requerido')
    .min(3, 'El motivo debe tener al menos 3 caracteres')
    .max(200, 'El motivo no puede exceder 200 caracteres'),
});

// ============= TIPOS INFERIDOS =============
export type ProductoFormData = z.infer<typeof productoSchema>;
export type UpdateProductoFormData = z.infer<typeof updateProductoSchema>;
export type VentaFormData = z.infer<typeof ventaSchema>;
export type ProveedorFormData = z.infer<typeof proveedorSchema>;
export type UpdateProveedorFormData = z.infer<typeof updateProveedorSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type UsuarioFormData = z.infer<typeof usuarioSchema>;
export type ActualizarStockFormData = z.infer<typeof actualizarStockSchema>;
export type MotivoAjusteFormData = z.infer<typeof motivoAjusteSchema>;
