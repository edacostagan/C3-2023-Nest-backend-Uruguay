import { NotFoundException } from '@nestjs/common';

import { DocumentTypeEntity } from '../../../../data/persistence';
import { DocumentTypeDto } from '../../../../business/dtos/document-type.dto';

export interface IDocumentTypeFactory {
    create(documentType: DocumentTypeDto): DocumentTypeEntity;
  }
  
  export class IdCard implements IDocumentTypeFactory {
    private static instance: DocumentTypeEntity;
  
    constructor() {}
  
    create(documentType: DocumentTypeDto): DocumentTypeEntity {
      IdCard.instance = new DocumentTypeEntity();
      IdCard.instance.name = 'ID Card';
      return IdCard.instance;
    }
  
    getInstance(documentTypeDTO: DocumentTypeDto): DocumentTypeEntity {
      if (!IdCard.instance) {
        IdCard.instance = this.create(documentTypeDTO);
      }
  
      return IdCard.instance;
    }
  }
  
  export class PassportID implements IDocumentTypeFactory {
    private static instance: DocumentTypeEntity;
  
    constructor() {}
  
    create(documentType: DocumentTypeDto): DocumentTypeEntity {
      PassportID.instance = new DocumentTypeEntity();
      PassportID.instance.name = 'Passport ID';
      return PassportID.instance;
    }
  
    getInstance(documentType: DocumentTypeDto): DocumentTypeEntity {
      if (!PassportID.instance) {
        PassportID.instance = this.create(documentType);
      }
  
      return PassportID.instance;
    }
  }
  
  export class DocumentTypeFactory {
  
    createDocumentType(documentType: DocumentTypeDto): DocumentTypeEntity {
  
  
      if (documentType.name === 'ID Card') {
          const document = new IdCard();
          return document.getInstance(documentType);
      } else if (documentType.name === 'Passport ID') {
          const document = new PassportID();
          return document.getInstance(documentType);
      } else {
          throw new NotFoundException("Factory not found");
      }
  
    }
  }