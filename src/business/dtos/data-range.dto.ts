import { IsNumber } from 'class-validator';

export class DataRangeDto{
    
    @IsNumber()
    start?: number;
    
    @IsNumber()
    end?: number;
}