import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { query } from 'express';
import { AdminGuard } from 'guard/admin.guard';
import { AuthGuard } from 'guard/auth.guard';
import { Serialize } from 'interceptors/serialize.interceptor';
import { CurrentUser } from 'user/decorator/current-user.decorator';
import { User } from 'user/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';

// Authentication -> 누가 요청했는지 아는것 (인터셉터하여 누가 요청했는지 알아내는 등 같은것, 여기 프로젝트에서는 요청에 userId 세션이 있으면 service에서 find하여 currentUser 헤더에 넣어서 관리한다.)
// Authorization -> 요청한사람이 권한이 있는지 알아내는것

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(parseInt(id), body);
  }
}
