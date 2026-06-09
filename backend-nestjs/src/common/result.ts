// 统一接口返回结构体的类型定义
export interface ResultData<T = any> {
  code: number; // 业务状态码：200 成功，其它为失败
  message: string; // 提示信息
  data: T; // 实际返回的数据
}

// Result 工具类，提供统一的成功/失败返回方法
export class Result {
  // 成功返回，默认 code=200
  static ok<T>(data: T = null as any, message = '操作成功'): ResultData<T> {
    // 组装并返回统一成功结构
    return { code: 200, message, data };
  }

  // 失败返回，默认 code=500
  static fail(message = '操作失败', code = 500): ResultData<null> {
    // 组装并返回统一失败结构
    return { code, message, data: null };
  }
}
