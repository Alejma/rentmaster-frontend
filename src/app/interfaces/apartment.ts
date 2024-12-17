export interface Apartment {
    apartment_id: number;
    admin_id: number;
    tenant_id: number; // Este podría ser un ID o el objeto del arrendatario
    tenant_name?: string; // Agrega esta línea para incluir el nombre del arrendatario
    name: string;
    address: string;
    description: string;
    status: string;
    rent_price: number;
}