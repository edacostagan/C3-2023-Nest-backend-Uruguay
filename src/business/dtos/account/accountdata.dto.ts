

export class AccountDataDto {

    accountId: string;
    accountTypeId: string;
    accountTypeName: string;
    customerId: string;
    customerName: string;
    balance: number;
    state: boolean;
    deletedAt?: number | Date;
}