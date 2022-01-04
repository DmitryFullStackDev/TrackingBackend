import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx): any => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
