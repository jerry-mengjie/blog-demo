// 引入 class-validator 校验装饰器
import { IsNotEmpty, IsOptional } from 'class-validator';

// 发表评论请求体校验类
export class CreateCommentDto {
  // 文章ID必填
  @IsNotEmpty({ message: '文章ID不能为空' })
  articleId: number; // 评论所属文章

  // 评论内容必填
  @IsNotEmpty({ message: '评论内容不能为空' })
  content: string; // 评论内容

  // 父评论ID可选，用于回复
  @IsOptional()
  parentId?: number; // 父评论ID，0或不传为一级评论
}
