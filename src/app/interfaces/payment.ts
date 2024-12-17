export interface Payment {
    payment_id?: number; // Opcional para creación
    tenant_id: number;
    amount: number;
    payment_date?: string | null; // Opcional o nulo
    payment_method?: string | null; // Opcional o nulo
    status: string; // Ejemplo: 'pending', 'completed'
  }
  