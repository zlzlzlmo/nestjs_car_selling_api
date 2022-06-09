import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'user/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  createEstimate({ make, model, lng, lat, year }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .getRawMany();
  }

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    const result = await this.repo.save(report);
    return result;
  }

  async changeApproval(id: number, body: ApproveReportDto) {
    const report = await this.repo.findOneBy({
      id,
    });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = body.approved;

    return this.repo.save(report);
  }
}
