import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// 선수 정보 인터페이스
export interface PlayerData {
  id: number;
  name: string;
  position: string;
  x: number;
  y: number;
  isBench?: boolean;
}

@Entity('squads')
export class Squad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  formation: string;

  @Column('simple-json')
  players: PlayerData[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

