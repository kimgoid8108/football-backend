import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SquadService } from './squad.service';
import { CreateSquadDto } from './dto/create-squad.dto';
import { UpdateSquadDto } from './dto/update-squad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('squads')
@UseGuards(JwtAuthGuard)
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  // 스쿼드 생성
  @Post()
  create(@Body() createSquadDto: CreateSquadDto, @Request() req) {
    return this.squadService.create(createSquadDto, req.user.userId);
  }

  // 모든 스쿼드 조회 (현재 사용자의 스쿼드만)
  @Get()
  async findAll(@Request() req) {
    try {
      return await this.squadService.findAll(req.user.userId);
    } catch (error) {
      console.error('스쿼드 목록 조회 컨트롤러 에러:', error);
      throw error;
    }
  }

  // 특정 스쿼드 조회
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.squadService.findOne(id, req.user.userId);
  }

  // 스쿼드 수정
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSquadDto: UpdateSquadDto,
    @Request() req,
  ) {
    return this.squadService.update(id, updateSquadDto, req.user.userId);
  }

  // 스쿼드 삭제
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.squadService.remove(id, req.user.userId);
  }
}
