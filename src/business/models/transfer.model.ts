export interface TransferModel{
    id: string;
    outcome: string;
    income: string;
    amount: number;
    reason: string;
    datetime: number;
    deletedAt?: Date | number;
}