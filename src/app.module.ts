import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './auth/auth.entity';
import { AuthModule } from './auth/auth.module';
import { Report } from './reports/reports.entity';
import { ReportsModule } from './reports/reports.module';

@Module({
  // type orm이 sqlite를 db.sqlite라는 파일 이름으로 root 경로에 만들어줌
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    AuthModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
