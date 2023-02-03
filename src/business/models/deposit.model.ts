export interface DepositModel{
    id: string;
    accountId: string;
    amount: number;
    dateTime: number;
    deletedAt?: Date | number;
}