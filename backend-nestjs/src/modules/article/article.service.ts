// 引入 Nest 注入与异常类
import { Injectable, NotFoundException } from '@nestjs/common';
// 引入 TypeORM 仓库注入装饰器
import { InjectRepository } from '@nestjs/typeorm';
// 引入仓库与查询条件构造工具
import { Repository, In, Like } from 'typeorm';
// 引入文章实体
import { Article } from '../../entities/article.entity';
// 引入文章标签关联实体
import { ArticleTag } from '../../entities/article-tag.entity';
// 引入标签实体
import { Tag } from '../../entities/tag.entity';
// 引入分类实体
import { Category } from '../../entities/category.entity';
// 引入用户实体
import { User } from '../../entities/user.entity';
// 引入创建文章 DTO
import { CreateArticleDto } from './dto/create-article.dto';
// 引入编辑文章 DTO
import { UpdateArticleDto } from './dto/update-article.dto';

// 声明文章服务
@Injectable()
export class ArticleService {
  // 注入多个实体仓库
  constructor(
    @InjectRepository(Article) private readonly articleRepo: Repository<Article>, // 文章仓库
    @InjectRepository(ArticleTag) private readonly articleTagRepo: Repository<ArticleTag>, // 文章标签关联仓库
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>, // 标签仓库
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>, // 分类仓库
    @InjectRepository(User) private readonly userRepo: Repository<User>, // 用户仓库
  ) {}

  // 给文章列表批量补充分类名、作者昵称等展示字段
  private async fillExtra(list: Article[]) {
    // 列表为空直接返回
    if (list.length === 0) return list;
    // 收集所有分类ID（去重）
    const categoryIds = [...new Set(list.map((a) => a.categoryId).filter(Boolean))];
    // 收集所有作者ID（去重）
    const userIds = [...new Set(list.map((a) => a.userId).filter(Boolean))];
    // 查询用到的分类
    const categories = categoryIds.length
      ? await this.categoryRepo.findBy({ id: In(categoryIds) })
      : [];
    // 查询用到的作者
    const users = userIds.length ? await this.userRepo.findBy({ id: In(userIds) }) : [];
    // 把分类组装成 id->name 的映射，便于查找
    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    // 把作者组装成 id->nickname 的映射
    const userMap = new Map(users.map((u) => [u.id, u.nickname || u.username]));
    // 给每条文章附加分类名与作者名
    return list.map((a) => ({
      ...a, // 展开原始文章字段
      categoryName: catMap.get(a.categoryId) || '', // 分类名称
      authorName: userMap.get(a.userId) || '', // 作者名称
    }));
  }

  // 分页查询文章列表
  async list(page = 1, pageSize = 10, categoryId?: number) {
    // 计算跳过的记录数
    const skip = (Number(page) - 1) * Number(pageSize);
    // 组装查询条件：只查已发布的文章
    const where: any = { status: 1 };
    // 若传了分类ID则加上分类过滤
    if (categoryId) where.categoryId = Number(categoryId);
    // 查询数据与总条数
    const [list, total] = await this.articleRepo.findAndCount({
      where, // 过滤条件
      order: { isTop: 'DESC', createTime: 'DESC' }, // 置顶优先、再按时间倒序
      skip, // 跳过条数
      take: Number(pageSize), // 取条数
    });
    // 补充展示字段后返回分页结构
    return { list: await this.fillExtra(list), total, page: Number(page), pageSize: Number(pageSize) };
  }

  // 查询文章详情，并让浏览量 +1
  async detail(id: number) {
    // 根据主键查询文章
    const article = await this.articleRepo.findOne({ where: { id } });
    // 不存在则抛出 404
    if (!article) throw new NotFoundException('文章不存在');
    // 浏览量自增 1
    await this.articleRepo.increment({ id }, 'viewCount', 1);
    // 同步更新内存对象的浏览量
    article.viewCount += 1;
    // 查询该文章关联的标签ID
    const relations = await this.articleTagRepo.findBy({ articleId: id });
    // 取出标签ID数组
    const tagIds = relations.map((r) => r.tagId);
    // 根据标签ID查询标签详情
    const tags = tagIds.length ? await this.tagRepo.findBy({ id: In(tagIds) }) : [];
    // 复用 fillExtra 补充分类名与作者名
    const [filled] = await this.fillExtra([article]);
    // 返回文章详情 + 标签列表
    return { ...filled, tags };
  }

  // 维护文章与标签的多对多关系
  private async saveTags(articleId: number, tagIds?: number[]) {
    // 先删除该文章已有的全部标签关联
    await this.articleTagRepo.delete({ articleId });
    // 没有传标签则直接结束
    if (!tagIds || tagIds.length === 0) return;
    // 构造新的关联记录数组
    const relations = tagIds.map((tagId) => this.articleTagRepo.create({ articleId, tagId }));
    // 批量保存关联
    await this.articleTagRepo.save(relations);
  }

  // 发布文章
  async create(userId: number, dto: CreateArticleDto) {
    // 创建文章实体
    const article = this.articleRepo.create({
      userId, // 作者为当前登录用户
      title: dto.title, // 标题
      content: dto.content, // 正文
      cover: dto.cover, // 封面
      summary: dto.summary, // 摘要
      categoryId: dto.categoryId, // 分类
      isTop: dto.isTop ?? 0, // 是否置顶，默认0
    });
    // 保存文章得到主键
    const saved = await this.articleRepo.save(article);
    // 维护标签关联
    await this.saveTags(saved.id, dto.tagIds);
    // 返回新文章
    return saved;
  }

  // 编辑文章
  async update(id: number, dto: UpdateArticleDto) {
    // 查询文章是否存在
    const article = await this.articleRepo.findOne({ where: { id } });
    // 不存在则抛 404
    if (!article) throw new NotFoundException('文章不存在');
    // 更新文章基础字段（仅更新传入的字段）
    await this.articleRepo.update(id, {
      title: dto.title, // 标题
      content: dto.content, // 正文
      cover: dto.cover, // 封面
      summary: dto.summary, // 摘要
      categoryId: dto.categoryId, // 分类
      isTop: dto.isTop, // 是否置顶
    });
    // 若传了 tagIds 则重新维护标签关联
    if (dto.tagIds) await this.saveTags(id, dto.tagIds);
    // 返回更新后的详情
    return this.articleRepo.findOne({ where: { id } });
  }

  // 删除文章
  async remove(id: number) {
    // 查询文章是否存在
    const article = await this.articleRepo.findOne({ where: { id } });
    // 不存在则抛 404
    if (!article) throw new NotFoundException('文章不存在');
    // 删除文章本身
    await this.articleRepo.delete(id);
    // 删除该文章的标签关联
    await this.articleTagRepo.delete({ articleId: id });
    // 返回被删除的ID
    return { id };
  }

  // 置顶文章列表
  async top() {
    // 查询 is_top=1 且已发布的文章，按时间倒序
    const list = await this.articleRepo.find({
      where: { isTop: 1, status: 1 }, // 置顶且已发布
      order: { createTime: 'DESC' }, // 时间倒序
      take: 10, // 最多取10条
    });
    // 补充展示字段后返回
    return this.fillExtra(list);
  }

  // 文章搜索（按标题模糊匹配）
  async search(keyword: string, page = 1, pageSize = 10) {
    // 计算跳过条数
    const skip = (Number(page) - 1) * Number(pageSize);
    // 按标题模糊查询已发布文章
    const [list, total] = await this.articleRepo.findAndCount({
      where: { title: Like(`%${keyword || ''}%`), status: 1 }, // 标题包含关键词
      order: { createTime: 'DESC' }, // 时间倒序
      skip, // 跳过
      take: Number(pageSize), // 取数
    });
    // 补充展示字段后返回分页结构
    return { list: await this.fillExtra(list), total, page: Number(page), pageSize: Number(pageSize) };
  }
}
