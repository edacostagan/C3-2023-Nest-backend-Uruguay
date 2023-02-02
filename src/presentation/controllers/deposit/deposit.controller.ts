import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { DepositService } from 'src/business/services';
import { CreateDepositDto } from 'src/business/dtos';
import { PaginationEntity, DepositEntity } from '../../../data/persistence/entities';
import { DataRangeModel } from '../../../../dist/business/models/data-range.model';
import { PaginationDto } from '../../../business/dtos/pagination.dto';
import { DataRangeDto } from '../../../business/dtos/data-range.dto';

@Controller('deposit')
export class DepositController {

    constructor(private depositService: DepositService) { }


    //TODO: verify JWT for the user ( if is allow to make transactions )

    // Create new deposit        
    @Post('register')
    async createDeposit(@Body() deposit: CreateDepositDto): Promise<DepositEntity> {

        return await this.depositService.createDeposit(deposit);
    }

    // delete Deposit ( Only soft delete from here )
    @Delete('delete/:id')
    deleteDeposit(@Param('id', ParseUUIDPipe) depositId: string,
        @Query('soft', ParseBoolPipe) soft?: boolean): void {

        this.depositService.deleteDeposit(depositId, soft);
    }


    // Get historical Data    
    @Get('/:id')
    getDeposit(@Param('id', ParseUUIDPipe) depositId: string,
        @Query('limit') limit?: number, 
        @Query('start') start?: number, 
        @Query('end') end?: number)
        : DepositEntity[] {

        const range = new DataRangeDto();
        range.start=start;
        range.end=end;

        const page = new PaginationDto();
        page.limit = limit;        
        page.offset = 0;

        return this.depositService.getHistory(depositId, page, range);

    }
}
