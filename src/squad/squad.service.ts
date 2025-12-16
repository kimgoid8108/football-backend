import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Squad } from './entities/squad.entity';
import { CreateSquadDto } from './dto/create-squad.dto';
import { UpdateSquadDto } from './dto/update-squad.dto';

@Injectable()
export class SquadService {
  constructor(
    @InjectRepository(Squad)
    private squadRepository: Repository<Squad>,
  ) {}

  // 스쿼드 생성
  async create(createSquadDto: CreateSquadDto): Promise<Squad> {
    const squad = this.squadRepository.create(createSquadDto);
    return await this.squadRepository.save(squad);
  }

  // 모든 스쿼드 조회
  async findAll(): Promise<Squad[]> {
    return await this.squadRepository.find({
      order: { updatedAt: 'DESC' },
    });
  }

  // 특정 스쿼드 조회
  async findOne(id: number): Promise<Squad> {
    const squad = await this.squadRepository.findOne({ where: { id } });
    if (!squad) {
      throw new NotFoundException(`스쿼드를 찾을 수 없습니다. (ID: ${id})`);
    }
    return squad;
  }

  // 스쿼드 수정
  async update(id: number, updateSquadDto: UpdateSquadDto): Promise<Squad> {
    const squad = await this.findOne(id);
    Object.assign(squad, updateSquadDto);
    return await this.squadRepository.save(squad);
  }

  // 스쿼드 삭제
  async remove(id: number): Promise<void> {
    const squad = await this.findOne(id);
    await this.squadRepository.remove(squad);
  }
}

