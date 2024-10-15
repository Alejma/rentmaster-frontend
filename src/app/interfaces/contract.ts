export interface Contract{
    contract_id?: number,
    apartment_id: number,
    tenant_id: number,
    admin_id: number,
    amount: number,
    warranty: number,
    type_contract: string,
    payment_Method: string,
    status: string,
    terms_conditions: string,
    signed_date: string,
    start_date: string,
    end_date: string
}
/*
"signed_date": "2024-10-10T00:00:00.000Z",
"start_date": "2024-10-10T00:00:00.000Z",
"end_date": "2024-11-10T00:00:00.000Z"
*/