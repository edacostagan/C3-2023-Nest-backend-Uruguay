import { DocumentTypeModel } from "../models";

export class CustomerDto{

    id: string;
    documentType: DocumentTypeModel;
    document: string;
    fullname: string;
    email: string;
    phone: string;
    password: string;
    avatarUrl?: string;
    state: boolean;
    deletedAt?: Date | number;
}