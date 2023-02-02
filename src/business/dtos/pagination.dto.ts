import { IsNumber } from 'class-validator';

export class PaginationDto{
    
    @IsNumber()
    offset?: number;
    
    @IsNumber()
    limit?: number;
}