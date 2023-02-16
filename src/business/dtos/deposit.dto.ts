export class DepositDto{
    id : string;
    accountId: string;
    amount: number;
    dateTime: number; //dateTime can be set automatic or must receive data from service??
    deletedAt?: number | Date;
}