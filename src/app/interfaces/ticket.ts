export interface Ticket {
    ticket_id?: number; // Opcional ya que es autogenerado
    tenant_id: number;  // Relación con el arrendatario (tenant)
    apartment_id: number;  // Relación con el apartamento
    subject: string;  // Asunto del ticket
    description: string;  // Descripción del problema o solicitud
    status: string;  // Estado del ticket (por ejemplo: 'abierto', 'en proceso', 'cerrado')
    createdAt?: Date;  // Fecha de creación del ticket (opcional, puede venir del backend)
    updatedAt?: Date;  // Fecha de última actualización (opcional, puede venir del backend)
}
