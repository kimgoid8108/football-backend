import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 사용자 생성
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    const savedUser = await this.userRepository.save(user);

    // JWT 토큰 생성
    const payload = { sub: savedUser.id, email: savedUser.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // 사용자 찾기
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // JWT 토큰 생성
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // 사용자 찾기
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      // 보안을 위해 사용자가 없어도 성공 메시지 반환
      return {
        message: '이메일로 비밀번호 재설정 링크를 보냈습니다.',
      };
    }

    // 재설정 토큰 생성 (1시간 유효)
    const payload = {
      sub: user.id,
      email: user.email,
      type: 'password-reset',
    };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    // 실제로는 여기서 이메일을 보내야 하지만, 이메일 서비스가 없으므로
    // 토큰을 반환합니다 (프로덕션에서는 이메일로 전송)
    return {
      message: '비밀번호 재설정 토큰이 생성되었습니다.',
      resetToken, // 개발 환경에서만 반환 (프로덕션에서는 이메일로 전송)
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      // 토큰 검증
      const payload = this.jwtService.verify(resetPasswordDto.token, {
        secret:
          this.configService.get<string>('JWT_SECRET') || 'your-secret-key',
      });

      // 토큰 타입 확인
      if (payload.type !== 'password-reset') {
        throw new BadRequestException('유효하지 않은 재설정 토큰입니다.');
      }

      // 사용자 찾기
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      // 새 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

      // 비밀번호 업데이트
      user.password = hashedPassword;
      await this.userRepository.save(user);

      return {
        message: '비밀번호가 성공적으로 변경되었습니다.',
      };
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new BadRequestException(
          '유효하지 않거나 만료된 재설정 토큰입니다.',
        );
      }
      throw error;
    }
  }
}
