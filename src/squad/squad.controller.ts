import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SquadService } from './squad.service';
import { CreateSquadDto } from './dto/create-squad.dto';
import { UpdateSquadDto } from './dto/update-squad.dto';

@Controller('squads')
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  // 스쿼드 생성
  @Post()
  create(@Body() createSquadDto: CreateSquadDto) {
    return this.squadService.create(createSquadDto);
  }

  // 모든 스쿼드 조회
  @Get()
  async findAll() {
    try {
      return await this.squadService.findAll();
    } catch (error) {
      console.error('스쿼드 목록 조회 컨트롤러 에러:', error);
      throw error;
    }
  }

  // 특정 스쿼드 조회
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.squadService.findOne(id);
  }

  // 스쿼드 수정
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSquadDto: UpdateSquadDto,
  ) {
    return this.squadService.update(id, updateSquadDto);
  }

  // 스쿼드 삭제
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.squadService.remove(id);
  }
}
