import { Body, Controller, Delete, Get, Param, Post, Put, ParseUUIDPipe, Query, Patch } from '@nestjs/common';

import { CustomerService } from '../../../business/services';
import { CustomerEntity } from '../../../data/persistence/entities';
import { CustomerDto, PaginationDto, TokenResponseDto, UpdateCustomerDto } from '../../../business/dtos';


@Controller('customer')
export class CustomerController {

    constructor(private customerService: CustomerService) { }

    //TODO: Implment checks and controls - Verify user token


    //update account    
    @Put('update/:id')
     updateAccount(@Param('id') customerId: string,
        @Body() newDetails: UpdateCustomerDto):
        CustomerEntity {

        return this.customerService.updatedCustomer(customerId, newDetails);
    }

    // Get list of customers
    @Get()
    getCustomers(@Query('limit') limit?: number): CustomerDto[] {

        const page = new PaginationDto();
        page.offset = 0;

        if (limit) { page.limit = limit; }
        else { page.limit = Number.MAX_VALUE; }

        return this.customerService.getAll(page);
    }
    // get customer information
    @Get('/:id')
    getInformation(@Param('id', ParseUUIDPipe) customerId: string): CustomerDto {

        console.log("buscando usuarios con id: " +customerId)

        return this.customerService.getCustomerInfo(customerId);
    }

    // Unsuscribe customer
    @Post('unsubscribe/:id')
    async unsubscribeCustomer(@Param('id', ParseUUIDPipe) customerId: string): Promise<boolean> {

        return await this.customerService.unsubscribe(customerId);
    }

    // Suscribe customer
    @Post('subscribe/:id')
    async subscribeCustomer(@Param('id', ParseUUIDPipe) customerId: string): Promise<boolean> {

        return await this.customerService.subscribe(customerId);
    }

    @Get('email/:email')
    async findCustomerByEmail(@Param('email') customerEmail: string) : Promise<TokenResponseDto> {

        return await this.customerService.findCustomerByEmail(customerEmail);
    }
}
