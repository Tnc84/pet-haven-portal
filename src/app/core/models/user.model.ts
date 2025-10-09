export interface User {
  id: number | null;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  lastLoginDate: Date | null;
  lastLoginDateDisplay: Date | null;
  joinDate: Date | null;
  role: string;
  authorities: string[];
  isActive: boolean;
  isNotLocked: boolean;
}

export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isNotLocked: boolean;
}

export interface UserUpdateRequest extends UserCreateRequest {
  id: number;
}

export interface HttpResponse {
  httpStatusCode: number;
  httpStatus: string;
  reason: string;
  message: string;
}

