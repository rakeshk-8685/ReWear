import { Response } from 'express';

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
}

export class ApiResponse {
  public static success<T>(
    res: Response,
    message: string = 'Operation successful',
    data?: T,
    statusCode: number = 200,
    meta?: any
  ): Response {
    const payload: IApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(payload);
  }

  public static created<T>(
    res: Response,
    message: string = 'Resource created successfully',
    data?: T
  ): Response {
    return ApiResponse.success(res, message, data, 201);
  }

  public static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
