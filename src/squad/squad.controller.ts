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
  findAll() {
    return this.squadService.findAll();
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

