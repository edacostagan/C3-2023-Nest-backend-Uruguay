export interface DepositModel{
    id: string;
    accountId: string;
    amount: number;
    datetime: number;
    deletedAt?: Date | number;
}