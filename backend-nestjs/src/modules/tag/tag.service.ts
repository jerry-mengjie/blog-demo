// 引入 Nest 注入与异常类
import { Injectable, BadRequestException } from '@nestjs/common';
// 引入仓库注入装饰器
import { InjectRepository } from '@nestjs/typeorm';
// 引入仓库类型
import { Repository } from 'typeorm';
// 引入标签实体
import { Tag } from '../../entities/tag.entity';

// 声明标签服务
@Injectable()
export class TagService {
  // 注入标签仓库
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>, // 标签表仓库
  ) {}

  // 查询全部标签
  async list() {
    // 按 id 升序返回所有标签
    return this.tagRepo.find({ order: { id: 'ASC' } });
  }

  // 新增标签
  async add(name: string) {
    // 校验名称不能为空
    if (!name) throw new BadRequestException('标签名称不能为空');
    // 判断同名标签是否已存在
    const exist = await this.tagRepo.findOne({ where: { name } });
    // 已存在则提示
    if (exist) throw new BadRequestException('标签已存在');
    // 创建并保存新标签
    const tag = this.tagRepo.create({ name });
    // 保存到数据库并返回
    return this.tagRepo.save(tag);
  }
}
