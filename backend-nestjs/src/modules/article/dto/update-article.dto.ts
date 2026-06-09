// 引入 class-validator 校验装饰器（编辑时字段均可选）
import { IsOptional, IsArray } from 'class-validator';

// 编辑文章请求体校验类，所有字段均为可选
export class UpdateArticleDto {
  // 标题可选
  @IsOptional()
  title?: string; // 文章标题

  // 正文可选
  @IsOptional()
  content?: string; // 文章正文

  // 封面可选
  @IsOptional()
  cover?: string; // 封面图URL

  // 摘要可选
  @IsOptional()
  summary?: string; // 文章摘要

  // 分类ID可选
  @IsOptional()
  categoryId?: number; // 所属分类ID

  // 是否置顶可选
  @IsOptional()
  isTop?: number; // 是否置顶

  // 标签ID数组可选
  @IsOptional()
  @IsArray({ message: 'tagIds 必须为数组' })
  tagIds?: number[]; // 关联的标签ID集合
}
