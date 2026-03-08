import { Request, Response, NextFunction } from "express";

// KurrentDB returns bigints for some fields, this middleware converts them to strings to avoid issues with JSON parsing

export function bigIntJsonMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    const serialized = JSON.parse(
      JSON.stringify(body, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    return originalJson(serialized);
  };
  next();
}
