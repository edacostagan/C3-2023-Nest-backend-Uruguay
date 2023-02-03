import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { DepositService } from '../../../business/services';
import { CreateDepositDto, PaginationDto, DataRangeDto } from '../../../business/dtos';
import { DepositEntity } from '../../../data/persistence/entities';


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
        const page = new PaginationDto();

        if (limit) {
            if (start) {
                range.start = start;
                if (end) {
                    range.end = end;
                } else {
                    range.end = Number.MAX_VALUE;
                }
            }
            else {
                range.start = 0;
                range.end = Number.MAX_VALUE;
            }


            page.limit = limit;
            page.offset = 0;

        } else {

            page.limit = Number.MAX_VALUE;
            page.offset = 0;
            range.start = 0;
            range.end = Number.MAX_VALUE;
        }

        return this.depositService.getHistory(depositId, page, range);

    }

    /**
     * Check if there are start and end for a datarange and assign correct values
     * @param range dataRangeDto to evaluate
     * @param start range start     * 
     * @param end  range end
     * @returns range evaluated
     */
    private checkDataRange(range: DataRangeDto, start: number | undefined, end: number | undefined): DataRangeDto {

        if (start) {
            range.start = start;
            if (end) {
                range.end = end;
            } else {
                range.end = Number.MAX_VALUE;
            }
        }
        else {
            range.start = 0;
        }

        return range;
    }
}
