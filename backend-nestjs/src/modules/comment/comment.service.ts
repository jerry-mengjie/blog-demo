// 引入 Nest 注入与异常类
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// 引入仓库注入装饰器
import { InjectRepository } from '@nestjs/typeorm';
// 引入仓库与 In 条件工具
import { Repository, In } from 'typeorm';
// 引入评论实体
import { Comment } from '../../entities/comment.entity';
// 引入用户实体（用于补充评论人信息）
import { User } from '../../entities/user.entity';
// 引入创建评论 DTO
import { CreateCommentDto } from './dto/create-comment.dto';

// 声明评论服务
@Injectable()
export class CommentService {
  // 注入评论仓库与用户仓库
  constructor(
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>, // 评论仓库
    @InjectRepository(User) private readonly userRepo: Repository<User>, // 用户仓库
  ) {}

  // 查询某篇文章的评论列表并组装成两级树结构
  async listByArticle(articleId: number) {
    // 查询该文章下状态正常的评论，按时间正序
    const comments = await this.commentRepo.find({
      where: { articleId, status: 1 }, // 指定文章且状态正常
      order: { createTime: 'ASC' }, // 时间正序
    });
    // 收集所有评论人ID（去重）
    const userIds = [...new Set(comments.map((c) => c.userId))];
    // 查询评论人信息
    const users = userIds.length ? await this.userRepo.findBy({ id: In(userIds) }) : [];
    // 组装 id->用户 的映射
    const userMap = new Map(users.map((u) => [u.id, u]));
    // 给每条评论附加用户昵称和头像
    const withUser = comments.map((c) => ({
      ...c, // 展开评论字段
      nickname: userMap.get(c.userId)?.nickname || userMap.get(c.userId)?.username || '匿名', // 评论人昵称
      avatar: userMap.get(c.userId)?.avatar || '', // 评论人头像
      children: [] as any[], // 子评论容器
    }));
    // 用 Map 便于按 id 查找父评论
    const map = new Map(withUser.map((c) => [c.id, c]));
    // 存放一级评论
    const roots: any[] = [];
    // 遍历组装树结构
    withUser.forEach((c) => {
      // parentId 为 0 或找不到父级时视为一级评论
      if (!c.parentId || !map.has(c.parentId)) {
        roots.push(c); // 加入一级列表
      } else {
        map.get(c.parentId)!.children.push(c); // 否则挂到父评论的 children 下
      }
    });
    // 返回树形评论列表
    return roots;
  }

  // 发表评论
  async add(userId: number, dto: CreateCommentDto) {
    // 创建评论实体
    const comment = this.commentRepo.create({
      articleId: Number(dto.articleId), // 文章ID
      userId, // 评论人为当前登录用户
      content: dto.content, // 评论内容
      parentId: Number(dto.parentId) || 0, // 父评论ID，默认0
    });
    // 保存并返回
    return this.commentRepo.save(comment);
  }

  // 删除评论（仅本人或管理员可删）
  async remove(id: number, userId: number, isAdmin: number) {
    // 查询评论是否存在
    const comment = await this.commentRepo.findOne({ where: { id } });
    // 不存在则抛 404
    if (!comment) throw new NotFoundException('评论不存在');
    // 非本人且非管理员则禁止
    if (comment.userId !== userId && Number(isAdmin) !== 1) {
      throw new ForbiddenException('无权删除该评论');
    }
    // 执行删除
    await this.commentRepo.delete(id);
    // 返回被删除ID
    return { id };
  }
}
