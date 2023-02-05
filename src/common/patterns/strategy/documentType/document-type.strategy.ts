import { DocumentTypeEntity } from "../../../../data/persistence/entities";
import { DocumentTypeFactory } from "../../factory/documentType";



export interface IDocumentTypeStrategy {
    assignDocumentType(): DocumentTypeEntity;
}

export class IdCardStrategy implements IDocumentTypeStrategy {

    assignDocumentType(): DocumentTypeEntity {
        const documentTypeFactory = new DocumentTypeFactory();
        return documentTypeFactory.createDocumentType({name: 'ID Card'});
    }

}

export class PassportStrategy implements IDocumentTypeStrategy {

    assignDocumentType(): DocumentTypeEntity {
        const documentTypeFactory = new DocumentTypeFactory();
        return documentTypeFactory.createDocumentType({name: 'Passport ID'});
    }

}

export class DocumentTypeContext {
    private strategy: IDocumentTypeStrategy;

    constructor(strategy: IDocumentTypeStrategy) {
        this.strategy = strategy;
    }

    assignDocumentTypeStrategy(): DocumentTypeEntity {
        return this.strategy.assignDocumentType();
    }
}