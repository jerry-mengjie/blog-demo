// 引入 class-validator 校验装饰器
import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

// 发布文章请求体校验类
export class CreateArticleDto {
  // 标题必填
  @IsNotEmpty({ message: '标题不能为空' })
  title: string; // 文章标题

  // 正文内容必填
  @IsNotEmpty({ message: '内容不能为空' })
  content: string; // 文章正文

  // 封面可选
  @IsOptional()
  cover?: string; // 封面图URL

  // 摘要可选
  @IsOptional()
  summary?: string; // 文章摘要

  // 分类ID可选
  @IsOptional()
  categoryId?: number; // 所属分类ID

  // 是否置顶可选（0/1）
  @IsOptional()
  isTop?: number; // 是否置顶

  // 标签ID数组可选，用于维护多对多关系
  @IsOptional()
  @IsArray({ message: 'tagIds 必须为数组' })
  tagIds?: number[]; // 关联的标签ID集合
}
