import { Injectable } from '@nestjs/common/decorators';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';

import { DocumentTypeEntity } from '../entities';
import { BankInternalControl } from './base';
import { DocumentTypeRepositoryInterface } from './interfaces';


@Injectable()
export class DocumentTypeRepository extends BankInternalControl <DocumentTypeEntity> implements DocumentTypeRepositoryInterface{
    
    /**
     * Adds a new DocumentType entity to the Array of DocumentTypes
     * @param entity new object to be inserted in the array
     * @returns new entity added
     */
    register(entity: DocumentTypeEntity): DocumentTypeEntity {
        
        try{ // try to add the entity to the array
            
            const res = this.database.push(entity);            
            return this.database[res-1]; // all good, returns the new added entity 

        } catch (err){ // something went wrong, push didn't work

            throw new InternalServerErrorException(`Internal Error! (${err})`)
        }        
    }
    
    /**
     * Modify the data of the DocumentType that matches a given Id
     * @param id unique key identifier
     * @param entity object that provides the new updated data 
     */
    update(id: string, entity: DocumentTypeEntity): DocumentTypeEntity {
        
        try{        
           
            const targetEntityIndex = this.database.findIndex(data => data.id === id); //searchs for the position in the array of the entity with Id

            if(targetEntityIndex == -1){ // if the result of the search is an -1 (not found)
                throw new NotFoundException(); // gives and exception
            }

            this.database[targetEntityIndex] = {...this.database[targetEntityIndex], ...entity}; // update existing entity

            return this.database[targetEntityIndex]; // all good, returning update existing entity
            
        } catch (err){// something wrong happened

            throw new InternalServerErrorException(`Internal Error! (${err})`) // throws an internal Error
        }        
    }
    
    /**
     * Delete the DocumentType that matches a given Id
     * @param id unique key identifier
     * @param soft sets the deletion method to use (true = logical / false = permanent)
     */
    delete(id: string, soft?: boolean | undefined): void {
         
        try{        

            const targetEntityIndex = this.database.findIndex(data => data.id === id); //searchs for the position in the array of the entity with Id

            if(targetEntityIndex == -1){ // if the result of the search is an -1 (not found)
                throw new NotFoundException(); // gives and exception
            }  
            
            //TODO: implement Permanent deletion ( this entity hasn't logical delete )
        
        } catch (err){// something wrong happened

            throw new InternalServerErrorException(`Internal Error! (${err})`) // throws an internal Error
         }
    }
    
    /**
     * Returns the content of the array of DocumentTypes
     * @returns Array of entities 
     */
    findAll(): DocumentTypeEntity[] {
        
        try{ 
        
            return this.database;

        } catch (err){// something wrong happened

            throw new InternalServerErrorException(`Internal Error! (${err})`) // throws an internal Error

        }
    }
    
    /**
     * Search in the array for an entity that matches the Id provided
     * @param id unique key identifier 
     * @returns entity that matches the Id, if not present, it gives an NotFoundException
     */
    findOneById(id: string): DocumentTypeEntity {

        try{ // try to find an entity with a given Id

            const index = this.database.findIndex(entity => entity.id === id); //searchs for the position in the array of the entity with Id

            if(index == -1){ // if the result of the search is an -1 (not found)
                throw new NotFoundException(); // gives and exception
            }

            return this.database[index]; // all good, return the entity 

        }catch(err){ // something wrong happened

            throw new InternalServerErrorException(`Internal Error! (${err})`) // throws an internal Error
        }
    }
    
    findByState(state: boolean): DocumentTypeEntity[] {
        throw new Error('This method is not implemented');
      }
    
      findByName(name: string): DocumentTypeEntity[] {
        throw new Error('This method is not implemented');
      }
}