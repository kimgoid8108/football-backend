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
    console.log('스쿼드 생성 요청:', JSON.stringify(createSquadDto, null, 2));
    console.log(
      '선수 데이터 확인:',
      createSquadDto.players?.map((p) => ({
        id: p.id,
        name: p.name,
        position: p.position,
      })),
    );
    const squad = this.squadRepository.create(createSquadDto);
    console.log('생성된 스쿼드:', JSON.stringify(squad, null, 2));
    const saved = await this.squadRepository.save(squad);
    console.log('저장된 스쿼드:', JSON.stringify(saved, null, 2));
    return saved;
  }

  // 모든 스쿼드 조회
  async findAll(): Promise<Squad[]> {
    try {
      console.log('스쿼드 목록 조회 시작');
      const result = await this.squadRepository.find({
        order: { updatedAt: 'DESC' },
      });
      console.log(`스쿼드 목록 조회 성공: ${result.length}개`);
      if (result.length > 0) {
        console.log('첫 번째 스쿼드 선수 데이터:', result[0].players);
        console.log(
          '첫 번째 스쿼드 선수 이름 확인:',
          result[0].players?.map((p: any) => ({
            id: p.id,
            name: p.name,
            position: p.position,
          })),
        );
      }
      return result;
    } catch (error) {
      console.error('스쿼드 목록 조회 실패:', error);
      console.error('에러 상세:', JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        console.error('에러 스택:', error.stack);
      }
      throw error;
    }
  }

  // 특정 스쿼드 조회
  async findOne(id: number): Promise<Squad> {
    const squad = await this.squadRepository.findOne({ where: { id } });
    if (!squad) {
      throw new NotFoundException(`스쿼드를 찾을 수 없습니다. (ID: ${id})`);
    }
    console.log('조회된 스쿼드:', JSON.stringify(squad, null, 2));
    console.log('조회된 선수 데이터:', squad.players);
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
