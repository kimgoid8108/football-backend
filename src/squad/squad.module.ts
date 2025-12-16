import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SquadService } from './squad.service';
import { SquadController } from './squad.controller';
import { Squad } from './entities/squad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Squad])],
  controllers: [SquadController],
  providers: [SquadService],
})
export class SquadModule {}

