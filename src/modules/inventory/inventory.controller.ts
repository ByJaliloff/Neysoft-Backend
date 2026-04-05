import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.CASHIER)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Yeni qaimə yaratmaq (anbara mal daxil etmə)
  @Post()
  @ApiOperation({ summary: 'Yeni qaimə yarat (anbara mal daxil et)' })
  create(@Body() createInventoryDto: CreateInventoryDto, @Req() req: any) {
    return this.inventoryService.create(createInventoryDto, req.user.id);
  }

  // Qaimə tarixçəsini filterlərlə gətirmək
  @Get()
  @ApiOperation({ summary: 'Qaimə tarixçəsini gətir (filterlərlə)' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Başlanğıc tarix (məs: 2025-01-01)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Son tarix (məs: 2025-12-31)',
  })
  @ApiQuery({
    name: 'receiptCode',
    required: false,
    description: 'Qaimə kodu ilə axtarış (məs: INV-123456)',
  })
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('receiptCode') receiptCode?: string,
  ) {
    return this.inventoryService.findAll(startDate, endDate, receiptCode);
  }
}
