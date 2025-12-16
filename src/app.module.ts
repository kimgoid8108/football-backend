import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SquadModule } from './squad/squad.module';
import { Squad } from './squad/entities/squad.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'squad.db',
      entities: [Squad],
      synchronize: true, // 개발 환경에서만 사용
    }),
    SquadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
