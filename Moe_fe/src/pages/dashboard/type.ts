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
    code:string;
    name:string;
    createAt:string;
    userCreateCode:string;
    userCreateDisplayName:string;
    updateAt:string;
    userUpdateCode:string;
    userUpdateDisplayName:string;
}
//-------------------Color----------------------
export interface ColorAll {
    code:string;
    name:string;
    createAt:string;
    userCreateCode:string;
    userCreateDisplayName:string;
    updateAt:string;
    userUpdateCode:string;
    userUpdateDisplayName:string;
}
//-------------------Tag----------------------
export interface TagAll {
    code:string;
    name:string;
    createAt:string;
    userCreateCode:string;
    userCreateDisplayName:string;
    updateAt:string;
    userUpdateCode:string;
    userUpdateDisplayName:string;
}
//-------------------Brand----------------------
export interface BrandAll {
    code:string;
    name:string;
    createAt:string;
    userCreateCode:string;
    userCreateDisplayName:string;
    updateAt:string;
    userUpdateCode:string;
    userUpdateDisplayName:string;
}
//-------------------Category----------------------
export interface CategoryAll {
    code:string;
    name:string;
    createAt:string;
    userCreateCode:string;
    userCreateDisplayName:string;
    updateAt:string;
    userUpdateCode:string;
    userUpdateDisplayName:string;
}

//-------------------Blog----------------------
export interface BlogAll {
    code:string;
    title:string;
    image:string;
    description:string;
    createAt:string;
    userCreateCode:string;
    userCreateDisplayName:string;
    updateAt:string;
    userUpdateCode:string;
    userUpdateDisplayName:string;
}