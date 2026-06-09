-- ============================================================
-- 博客系统 数据库初始化脚本（通用博客最简版，共 7 张业务表）
-- 说明：项目使用 TypeORM synchronize=true 会自动建表，
--      本脚本用于手动建库/建表与初始化种子数据，二选一即可。
-- ============================================================

-- 创建数据库（若不存在），字符集使用 utf8mb4 以支持 emoji
CREATE DATABASE IF NOT EXISTS `blog_demo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- 切换到该数据库
USE `blog_demo`;

-- ------------------------------------------------------------
-- 1. tb_user 用户表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_user` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '用户主键ID',          -- 主键
  `username` VARCHAR(50) NOT NULL COMMENT '登录用户名',           -- 用户名
  `password` VARCHAR(255) NOT NULL COMMENT '加密后的密码',        -- 密码(加密)
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '用户昵称',         -- 昵称
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',           -- 头像
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱地址',           -- 邮箱
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间', -- 注册时间
  `status` TINYINT DEFAULT 1 COMMENT '状态:1正常 0禁用',          -- 状态
  `is_admin` TINYINT DEFAULT 0 COMMENT '是否管理员:1是 0否',      -- 是否管理员
  PRIMARY KEY (`id`),                                            -- 主键约束
  UNIQUE KEY `uk_username` (`username`)                          -- 用户名唯一
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ------------------------------------------------------------
-- 2. tb_article 文章表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_article` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '文章主键ID',          -- 主键
  `user_id` INT NOT NULL COMMENT '作者用户ID',                   -- 作者
  `title` VARCHAR(200) NOT NULL COMMENT '文章标题',              -- 标题
  `cover` VARCHAR(255) DEFAULT NULL COMMENT '封面图URL',          -- 封面
  `content` TEXT NOT NULL COMMENT '文章正文内容',                 -- 正文
  `summary` VARCHAR(500) DEFAULT NULL COMMENT '文章摘要',         -- 摘要
  `category_id` INT DEFAULT NULL COMMENT '所属分类ID',           -- 分类
  `view_count` INT DEFAULT 0 COMMENT '浏览量',                   -- 浏览量
  `is_top` TINYINT DEFAULT 0 COMMENT '是否置顶:1是 0否',          -- 置顶
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',                       -- 发布时间
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间', -- 更新时间
  `status` TINYINT DEFAULT 1 COMMENT '状态:1发布 0下架',          -- 状态
  PRIMARY KEY (`id`)                                            -- 主键约束
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- ------------------------------------------------------------
-- 3. tb_category 分类表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_category` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '分类主键ID',          -- 主键
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',                -- 名称
  `sort` INT DEFAULT 0 COMMENT '排序值,越小越靠前',              -- 排序
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间', -- 创建时间
  PRIMARY KEY (`id`),                                            -- 主键约束
  UNIQUE KEY `uk_cat_name` (`name`)                             -- 名称唯一
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- ------------------------------------------------------------
-- 4. tb_tag 标签表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_tag` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '标签主键ID',          -- 主键
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',                -- 名称
  PRIMARY KEY (`id`),                                            -- 主键约束
  UNIQUE KEY `uk_tag_name` (`name`)                             -- 名称唯一
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- ------------------------------------------------------------
-- 5. tb_article_tag 文章标签中间表（多对多）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_article_tag` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '关联主键ID',          -- 主键
  `article_id` INT NOT NULL COMMENT '文章ID',                    -- 文章
  `tag_id` INT NOT NULL COMMENT '标签ID',                        -- 标签
  PRIMARY KEY (`id`)                                            -- 主键约束
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签中间表';

-- ------------------------------------------------------------
-- 6. tb_comment 评论表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_comment` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '评论主键ID',          -- 主键
  `article_id` INT NOT NULL COMMENT '所属文章ID',               -- 文章
  `user_id` INT NOT NULL COMMENT '评论人用户ID',                -- 评论人
  `parent_id` INT DEFAULT 0 COMMENT '父评论ID,0为顶级',          -- 父评论
  `content` TEXT NOT NULL COMMENT '评论内容',                    -- 内容
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间', -- 时间
  `status` TINYINT DEFAULT 1 COMMENT '状态:1正常 0隐藏',          -- 状态
  PRIMARY KEY (`id`)                                            -- 主键约束
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- ------------------------------------------------------------
-- 7. tb_favorite 收藏表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_favorite` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '收藏主键ID',          -- 主键
  `user_id` INT NOT NULL COMMENT '收藏人用户ID',                -- 收藏人
  `article_id` INT NOT NULL COMMENT '被收藏文章ID',             -- 文章
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间', -- 时间
  PRIMARY KEY (`id`)                                            -- 主键约束
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- ============================================================
-- 初始化种子数据
-- ============================================================

-- 初始化管理员账号：用户名 admin / 密码 admin123（密码为 bcrypt 加密结果）
INSERT INTO `tb_user` (`username`, `password`, `nickname`, `email`, `status`, `is_admin`)
VALUES ('admin', '$2b$10$meUCHXbbYHHqQRADDB3vGei5FWmwdhCAdAMjSMMxku3QC0hVy/GGK', '超级管理员', 'admin@blog.com', 1, 1);

-- 初始化几个常用分类
INSERT INTO `tb_category` (`name`, `sort`) VALUES ('前端', 1), ('后端', 2), ('数据库', 3), ('随笔', 4);

-- 初始化几个常用标签
INSERT INTO `tb_tag` (`name`) VALUES ('Vue'), ('NestJS'), ('TypeScript'), ('MySQL');
