// 引入 Nest 注入
import { Injectable } from '@nestjs/common';
// 引入仓库注入装饰器
import { InjectRepository } from '@nestjs/typeorm';
// 引入仓库与 In 条件工具
import { Repository, In } from 'typeorm';
// 引入收藏实体
import { Favorite } from '../../entities/favorite.entity';
// 引入文章实体（用于补充收藏文章信息）
import { Article } from '../../entities/article.entity';

// 声明收藏服务
@Injectable()
export class FavoriteService {
  // 注入收藏仓库与文章仓库
  constructor(
    @InjectRepository(Favorite) private readonly favoriteRepo: Repository<Favorite>, // 收藏仓库
    @InjectRepository(Article) private readonly articleRepo: Repository<Article>, // 文章仓库
  ) {}

  // 收藏 / 取消收藏（切换状态）
  async toggle(userId: number, articleId: number) {
    // 查询当前用户是否已收藏该文章
    const exist = await this.favoriteRepo.findOne({
      where: { userId, articleId: Number(articleId) },
    });
    // 已收藏则取消
    if (exist) {
      // 删除收藏记录
      await this.favoriteRepo.delete(exist.id);
      // 返回当前为未收藏状态
      return { favorited: false };
    }
    // 未收藏则新增收藏记录
    const favorite = this.favoriteRepo.create({ userId, articleId: Number(articleId) });
    // 保存收藏
    await this.favoriteRepo.save(favorite);
    // 返回当前为已收藏状态
    return { favorited: true };
  }

  // 查询我的收藏列表
  async myList(userId: number) {
    // 查询当前用户的全部收藏，按时间倒序
    const favorites = await this.favoriteRepo.find({
      where: { userId }, // 当前用户
      order: { createTime: 'DESC' }, // 时间倒序
    });
    // 取出收藏的文章ID
    const articleIds = favorites.map((f) => f.articleId);
    // 根据文章ID查询文章详情
    const articles = articleIds.length
      ? await this.articleRepo.findBy({ id: In(articleIds) })
      : [];
    // 组装 id->文章 映射
    const articleMap = new Map(articles.map((a) => [a.id, a]));
    // 给每条收藏附加文章信息
    return favorites.map((f) => ({
      id: f.id, // 收藏记录ID
      articleId: f.articleId, // 文章ID
      createTime: f.createTime, // 收藏时间
      article: articleMap.get(f.articleId) || null, // 对应的文章信息
    }));
  }
}
