// 引入 Nest 注入与异常相关装饰器/类
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
// 引入 TypeORM 仓库注入装饰器
import { InjectRepository } from '@nestjs/typeorm';
// 引入仓库类型
import { Repository } from 'typeorm';
// 引入 JWT 服务用于生成令牌
import { JwtService } from '@nestjs/jwt';
// 引入 bcryptjs 用于密码加密与比对
import * as bcrypt from 'bcryptjs';
// 引入用户实体
import { User } from '../../entities/user.entity';
// 引入注册 DTO
import { RegisterDto } from './dto/register.dto';
// 引入登录 DTO
import { LoginDto } from './dto/login.dto';
// 引入更新资料 DTO
import { UpdateUserDto } from './dto/update-user.dto';
// 引入 JWT 配置常量
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../common/constants';

// 声明这是一个可注入的服务
@Injectable()
export class UserService {
  // 构造函数注入用户仓库与 JWT 服务
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>, // 用户表仓库
    private readonly jwtService: JwtService, // JWT 工具
  ) {}

  // 用户注册业务
  async register(dto: RegisterDto) {
    // 查询用户名是否已被占用
    const exist = await this.userRepo.findOne({ where: { username: dto.username } });
    // 已存在则抛出参数异常
    if (exist) throw new BadRequestException('用户名已存在');
    // 使用 bcrypt 对密码加密（盐值强度 10）
    const hashed = await bcrypt.hash(dto.password, 10);
    // 创建用户实体（昵称默认为用户名）
    const user = this.userRepo.create({
      username: dto.username, // 用户名
      password: hashed, // 加密后的密码
      nickname: dto.nickname || dto.username, // 昵称
      email: dto.email, // 邮箱
    });
    // 保存到数据库
    await this.userRepo.save(user);
    // 返回提示（不返回密码）
    return { id: user.id, username: user.username };
  }

  // 用户登录业务
  async login(dto: LoginDto) {
    // 根据用户名查询用户，并显式带出 password 字段
    const user = await this.userRepo
      .createQueryBuilder('u') // 创建查询构造器
      .addSelect('u.password') // 额外选择默认隐藏的 password
      .where('u.username = :username', { username: dto.username }) // 按用户名过滤
      .getOne(); // 取一条
    // 用户不存在则提示
    if (!user) throw new UnauthorizedException('用户名或密码错误');
    // 账号被禁用则提示
    if (user.status !== 1) throw new UnauthorizedException('账号已被禁用');
    // 比对明文密码与数据库加密密码
    const match = await bcrypt.compare(dto.password, user.password);
    // 密码不匹配则提示
    if (!match) throw new UnauthorizedException('用户名或密码错误');
    // 组装 JWT 载荷
    const payload = { userId: user.id, username: user.username, isAdmin: user.isAdmin };
    // 生成 JWT 令牌
    const token = this.jwtService.sign(payload, {
      secret: JWT_SECRET, // 密钥
      expiresIn: JWT_EXPIRES_IN, // 有效期
    });
    // 返回令牌与基本用户信息
    return {
      token, // 访问令牌
      userInfo: {
        id: user.id, // 用户ID
        username: user.username, // 用户名
        nickname: user.nickname, // 昵称
        avatar: user.avatar, // 头像
        isAdmin: user.isAdmin, // 是否管理员
      },
    };
  }

  // 获取个人信息业务
  async getInfo(userId: number) {
    // 根据主键查询用户（password 默认不返回）
    const user = await this.userRepo.findOne({ where: { id: userId } });
    // 不存在则抛异常
    if (!user) throw new BadRequestException('用户不存在');
    // 返回用户信息
    return user;
  }

  // 修改个人资料业务
  async updateInfo(userId: number, dto: UpdateUserDto) {
    // 按主键更新允许修改的字段
    await this.userRepo.update(userId, {
      nickname: dto.nickname, // 昵称
      avatar: dto.avatar, // 头像
      email: dto.email, // 邮箱
    });
    // 返回更新后的最新信息
    return this.getInfo(userId);
  }
}
