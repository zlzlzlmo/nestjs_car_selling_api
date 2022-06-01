import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReportsController } from './reports/reports.controller';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [AuthModule, ReportsModule],
  controllers: [AppController, ReportsController],
  providers: [AppService],
})
export class AppModule {}
