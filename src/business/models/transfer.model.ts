export interface TransferModel{
    id: string;
    outcome: string;
    income: string;
    amount: number;
    reason: string;
    dateTime: number;
    deletedAt?: Date | number;
}