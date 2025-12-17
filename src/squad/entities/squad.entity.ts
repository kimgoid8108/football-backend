import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

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

  @Column({ nullable: true })
  gameType: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.squads)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
