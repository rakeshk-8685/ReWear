import { ApiError } from '../utils/api-error';

export const validateRegisterInput = (body: any): void => {
  const { name, email, password } = body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw ApiError.badRequest('Name is required and must be at least 2 characters.');
  }
  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    throw ApiError.badRequest('A valid email address is required.');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters long.');
  }
};

export const validateLoginInput = (body: any): void => {
  const { email, password } = body;
  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required.');
  }
};
