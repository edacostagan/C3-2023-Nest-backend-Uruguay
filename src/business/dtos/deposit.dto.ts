export class DepositDto{
    id : string;
    accountId: string;
    amount: number;
    datetime: number; //dateTime can be set automatic or must receive data from service??
    deletedAt?: number | Date;
}