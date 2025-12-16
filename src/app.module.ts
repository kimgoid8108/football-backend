import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SquadModule } from './squad/squad.module';
import { Squad } from './squad/entities/squad.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE', 'sqlite');

        // PostgreSQL 설정
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5432),
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            entities: [Squad],
            synchronize: configService.get<string>('NODE_ENV') !== 'production',
            ssl:
              configService.get<string>('DB_SSL') === 'true'
                ? {
                    rejectUnauthorized: false,
                  }
                : false,
          };
        }

        // SQLite 설정 (기본값)
        return {
          type: 'better-sqlite3',
          database: configService.get<string>('DB_DATABASE', 'squad.db'),
          entities: [Squad],
          synchronize: true, // 개발 환경에서만 사용
        };
      },
      inject: [ConfigService],
    }),
    SquadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
