import {
  IsString,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class PlayerDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsNumber()
  @IsNotEmpty()
  x: number;

  @IsNumber()
  @IsNotEmpty()
  y: number;

  @IsOptional()
  @IsBoolean()
  isBench?: boolean;
}

export class CreateSquadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  formation: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerDto)
  players: PlayerDto[];

  @IsOptional()
  @IsString()
  @IsIn(['football', 'futsal'])
  gameType?: string;
}
