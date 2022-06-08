import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'guard/auth.guard';

// 요청 -> 미들웨어(쿠키세션 같은것) -> 가즈 -> ( interceptor ) -> request handler -> ( interceptor ) -> response

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
