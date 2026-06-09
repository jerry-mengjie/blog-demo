// 引入 Nest 注入与异常类
import { Injectable, BadRequestException } from '@nestjs/common';
// 引入仓库注入装饰器
import { InjectRepository } from '@nestjs/typeorm';
// 引入仓库类型
import { Repository } from 'typeorm';
// 引入分类实体
import { Category } from '../../entities/category.entity';

// 声明分类服务
@Injectable()
export class CategoryService {
  // 注入分类仓库
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>, // 分类表仓库
  ) {}

  // 查询全部分类，按 sort 升序
  async list() {
    // 返回所有分类，sort 越小越靠前
    return this.categoryRepo.find({ order: { sort: 'ASC', id: 'ASC' } });
  }

  // 新增分类
  async add(name: string, sort = 0) {
    // 校验名称不能为空
    if (!name) throw new BadRequestException('分类名称不能为空');
    // 判断同名分类是否已存在
    const exist = await this.categoryRepo.findOne({ where: { name } });
    // 已存在则提示
    if (exist) throw new BadRequestException('分类已存在');
    // 创建并保存新分类
    const category = this.categoryRepo.create({ name, sort: Number(sort) || 0 });
    // 保存到数据库并返回
    return this.categoryRepo.save(category);
  }
}
