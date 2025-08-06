export interface ActivityLog {
  code: string;
  type: string; // get/post/put/delete/path
  ip: string; // ip user
  responseCode: string; // 200, 500, 400, 404...
  message: string; // sự kiện gì
  error: string; // lỗi cụ thể
  data: string; // data json của request đó
  userCode: string; // mã người dùng thực hiện request
  createdAt: string;
}

export interface UserActivity {
  userCode: string;
  displayName: string;
  ip: string;
  firstAccessTime: string; // or Date, depending on your usage
}

export interface RolePermission {
  code: string;
  userCode: string;
  roleCode: string;
  roleName: string;
  canView?: boolean;
  canInsert?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  canRestore?: boolean;
}
export interface ListRolePer {
  rolePermissions: RolePermission[];
}

export interface Users {
  code: string;
  email: string;
  userName: string;
  displayName: string;
  bio: string;
  provider: string;
  location: string;
  avatar: string;
  dateOfBirth: string; // or Date if you prefer
  gender: string; // or an enum if defined elsewhere
  isVerified?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  userCreate?: string;
  userUpdate?: string;
  userDelete?: string;
  lastLogin?: string;
}

//-------------------Size----------------------
export interface SizeAll {
  code: string;
  name: string;
  createAt: string;
  userCreateCode: string;
  userCreateDisplayName: string;
  updateAt: string;
  userUpdateCode: string;
  userUpdateDisplayName: string;
}
//-------------------Color----------------------
export interface ColorAll {
  code: string;
  name: string;
  createAt: string;
  userCreateCode: string;
  userCreateDisplayName: string;
  updateAt: string;
  userUpdateCode: string;
  userUpdateDisplayName: string;
}
//-------------------Tag----------------------
export interface TagAll {
  code: string;
  name: string;
  createAt: string;
  userCreateCode: string;
  userCreateDisplayName: string;
  updateAt: string;
  userUpdateCode: string;
  userUpdateDisplayName: string;
}
//-------------------Brand----------------------
export interface BrandAll {
  code: string;
  name: string;
  createAt: string;
  userCreateCode: string;
  userCreateDisplayName: string;
  updateAt: string;
  userUpdateCode: string;
  userUpdateDisplayName: string;
}
//-------------------Category----------------------
export interface CategoryAll {
  code: string;
  name: string;
  createAt: string;
  userCreateCode: string;
  userCreateDisplayName: string;
  updateAt: string;
  userUpdateCode: string;
  userUpdateDisplayName: string;
}

//-------------------Blog----------------------
export interface BlogAll {
  code: string;
  title: string;
  image: string;
  description: string;
  createAt: string;
  userCreateCode: string;
  userCreateDisplayName: string;
  updateAt: string;
  userUpdateCode: string;
  userUpdateDisplayName: string;
}
//-------------------Product----------------------
export interface ProductAll {
  code: string;
  name: string;
  price: number; // hoặc dùng BigDecimal nếu bạn có custom type
  image: string;
  shortDescription: string;
  fullDescription: string;
  categoryCode: string;
  brandCode: string;
  listTagCode: string[];

  createAt: string;
  userCreateCode: string;
  userCreateDisplayName: string;
  updateAt: string;
  userUpdateCode: string;
  userUpdateDisplayName: string;
}

export interface ProductCreate {
  name: string;
  price: number; // tương ứng BigDecimal
  image: string;
  shortDescription: string;
  fullDescription: string;
  categoryCode: string;
  brandCode: string;
  listTagCode: string[];
}
export interface ProductUpdate {
  code: string;
  name: string;
  price: number; // BigDecimal tương ứng với number
  image: string;
  shortDescription: string;
  fullDescription: string;
  categoryCode: string;
  brandCode: string;
  listTagCode: string[];
}
//-------------------ProductVersion----------------------
export interface ProductVersionAll {
  code: string;
  name: string;
  quantity: number;
  image: string;
  sizeCode: string;
  colorCode: string;
  productCode: string;

  createAt: string;
  userCreateCode: string;
  userCreateDisplayName: string;
  updateAt: string;
  userUpdateCode: string;
  userUpdateDisplayName: string;
}

export interface ProductVersionCreate {
  name: string;
  quantity: number;
  image: string;
  sizeCode: string;
  colorCode: string;
  productCode: string;
}
export interface ProductVersionUpdate {
  code: string;
  name: string;
  quantity: number;
  image: string;
  sizeCode: string;
  colorCode: string;
  productCode: string;
}
//-------------------Discount----------------------
export interface DiscountAll {
  code: string;
  discountCode: string;
  discountType: 'PRODUCT' | 'CODE';
  description?: string;
  discountValue: number;
  maxDiscount: number;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  usageLimit: number;
  productCode?: string;
  productName?: string;

  createAt: string;
  userCreateCode: string;
  userCreateDisplayName: string;
  updateAt: string;
  userUpdateCode: string;
  userUpdateDisplayName: string;
}

export interface DiscountCreateCo {
  discountCode: string;
  discountType: 'PRODUCT' | 'CODE';
  description?: string;
  discountValue: number;      // max 50
  maxDiscount: number;
  startDate: string;          // ISO format: '2025-08-06T15:00:00'
  endDate?: string | null;    // nullable
  isActive: boolean;
  usageLimit: number;
}
export interface DiscountCreatePro {
  discountType: 'PRODUCT' | 'CODE';
  description?: string;
  discountValue: number;
  maxDiscount: number;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  productCode: string;
}
export interface DiscountUpdateCo {
  code: string;
  discountCode: string;
  discountType: 'PRODUCT' | 'CODE';
  description?: string;
  discountValue: number;
  maxDiscount: number;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  usageLimit: number;
}
export interface DiscountUpdatePro {
  code: string;
  discountType: 'PRODUCT' | 'CODE';
  description?: string;
  discountValue: number;
  maxDiscount: number;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  productCode: string;
}
