import { env } from '@/config';
import { Role } from '@/modules/user/user.constants';
import { jwtPayload } from '@/modules/user/user.validation';
import { AppError, catchAsync } from '@/utils';
import jwt from 'jsonwebtoken';

export function verifyToken(role?: Role) {
  return catchAsync((req, res, next) => {
    try {
      const bearerHeader: string =
        req.cookies.token || req.headers.authorization;

      if (!bearerHeader || !bearerHeader.startsWith('Bearer'))
        throw new Error();

      const token = bearerHeader.split(' ')[1];

      jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
        if (err) throw err;

        req.jwtPayload = jwtPayload.parse(decoded);

        if (role) {
          if (role === req.jwtPayload.role) {
            next();
          } else {
            throw new Error();
          }
        } else {
          next();
        }
      });
    } catch (err) {
      throw new AppError(401, 'Unauthorized access.');
    }
  });
}
