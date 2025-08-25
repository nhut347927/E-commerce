# Moe E-commerce

![Moe Logo](https://via.placeholder.com/150?text=Moe) <!-- Thay bằng logo thực nếu có -->

Moe là một nền tảng thương mại điện tử hiện đại, hỗ trợ bán hàng trực tuyến với giao diện thân thiện cho người dùng và bảng điều khiển quản trị mạnh mẽ. Dự án được phát triển để cung cấp trải nghiệm mua sắm mượt mà, tích hợp thanh toán, quản lý sản phẩm, đơn hàng và phân tích dữ liệu.

## Timeline Dự Án
- **Bắt đầu:** 26/07/2025
- **Hoàn thành cơ bản:** 25/08/2025
- **Kế hoạch phát triển:** 30 ngày, bao gồm thiết kế database, code project và file README.

## Tính Năng Chính
- **Phía Client (Người dùng):**
  - Trang chủ với carousel, banner (có thể tùy chỉnh qua settings), sản phẩm nổi bật và blog.
  - Trang sản phẩm: Lọc theo nhiều điều kiện (giá, danh mục, thương hiệu), sắp xếp, phân trang.
  - Trang blog: Hiển thị bài viết.
  - Trang liên hệ: Gửi email.
  - Trang yêu thích (wishlist).
  - Trang chi tiết sản phẩm: Hiển thị thông tin chi tiết, hình ảnh, đánh giá.
  - Trang giỏ hàng: Tăng/giảm số lượng, áp dụng discount.
  - Quy trình đặt hàng và thanh toán với VNPay (callback qua API server, yêu cầu domain để hoạt động đầy đủ).
  - Trang xem đơn hàng của khách hàng.

- **Phía Admin (Dashboard):**
  - Bảng điều khiển hiển thị báo cáo: Doanh thu theo tháng, đơn hàng theo trạng thái, top sản phẩm bán chạy, khách hàng mới, đơn hàng hàng ngày, doanh thu theo phương thức thanh toán, sản phẩm tồn kho thấp, tỉ lệ hủy đơn, tổng khách hàng, lợi nhuận gộp.
  - Trang log: Ghi lại các hoạt động POST, PUT, DELETE, lỗi.
  - Trang người dùng: Hiển thị và quản lý người dùng đã đăng nhập.
  - Trang phân quyền: Chỉ super admin có thể cập nhật.
  - Trang quản lý sản phẩm, phiên bản sản phẩm, danh mục, thương hiệu, tag, màu sắc, kích thước.
  - Trang đơn hàng: Xem và cập nhật trạng thái đơn hàng.
  - Trang discount: Quản lý giảm giá cho sản phẩm và mã giảm giá.
  - Trang blog: Quản lý bài viết.
  - Trang settings: Quản lý JSON cho home, filter giá, v.v. (đang nghiên cứu để đơn giản hóa).

- **Tích Hợp Khác:**
  - Đăng nhập/đăng ký với Google OAuth.
  - Xác thực JWT, bảo mật Spring Security.
  - Lưu trữ hình ảnh với Cloudinary.
  - Gửi email (quên mật khẩu, xác nhận).
  - Export Excel cho báo cáo.
  - PWA hỗ trợ offline.

## Công Nghệ Sử Dụng
Dự án Moe bao gồm 2 phần chính: Frontend (FE) và Backend (BE). Mỗi phần sử dụng các công nghệ, thư viện và framework hiện đại để đảm bảo hiệu suất, khả năng mở rộng và trải nghiệm người dùng tốt.

### 🖥️ Frontend (FE)
#### ⚙️ Framework & Công Cụ Chính
- **React 18**: Thư viện UI chính.
- **Vite 5**: Bundler thế hệ mới, tốc độ build & HMR siêu nhanh.
- **TypeScript 5.6**: Static typing, nâng cao tính an toàn và maintainable code.
- **TailwindCSS 3.4 + tailwind-merge + tailwindcss-animate**: Utility-first CSS framework, kèm plugin merge class và animation tiện dụng.
- **Radix UI** (Accordion, Dialog, Dropdown, Tabs, Tooltip, …): Component headless, dễ tùy biến.
- **Framer Motion**: Animation mượt mà, hỗ trợ UI/UX cao cấp.
- **lucide-react**: Bộ icon hiện đại, nhẹ.

#### 📦 State Management & Data Fetching
- **Redux Toolkit + React Redux**: Quản lý state tập trung, boilerplate tối giản.
- **React Hook Form + @hookform/resolvers**: Quản lý form mạnh mẽ, dễ validate.
- **Zod**: Schema validation cho form & API.
- **Axios**: HTTP client chính, dễ quản lý request/response.
- **React Router v6**: Routing SPA.

#### 🎨 UI/UX & Tiện Ích Khác
- **next-themes**: Dark mode & theme switcher.
- **react-dropzone**: Upload drag & drop.
- **date-fns**: Xử lý thời gian.
- **react-responsive**: Responsive design detection.
- **recharts**: Vẽ biểu đồ/thống kê.
- **vite-plugin-pwa**: Progressive Web App (offline, push notification).
- **lodash / clsx / class-variance-authority**: Helper functions, quản lý className linh hoạt.

#### 🛠️ Dev Tools
- **ESLint 9 + typescript-eslint**: Code linting.
- **@vitejs/plugin-react-swc**: Compiler React bằng SWC (cực nhanh).
- **PostCSS + Autoprefixer**: Tối ưu CSS.

### ⚙️ Backend (BE)
#### 🏗️ Framework & Cấu Hình
- **Spring Boot 3.3.4**: Framework backend chính.
- **Java 17**: Ngôn ngữ chính.
- **Maven**: Quản lý dependency & build tool.
- **Spring Boot DevTools**: Hỗ trợ hot reload khi dev.

#### 📊 Database & ORM
- **Spring Data JPA (Hibernate)**: ORM mapping entity.
- **MySQL**: Database chính (production).
- **H2 Database**: Database in-memory cho test.

#### 🔐 Bảo Mật & Xác Thực
- **Spring Security**: Authentication & Authorization.
- **JWT (jjwt-api, jjwt-impl, jjwt-jackson)**: Xác thực bằng JSON Web Token.
- **BCrypt / Commons Codec**: Hash password, xử lý bảo mật.

#### 📬 Tích Hợp & Dịch Vụ Ngoài
- **Spring Mail**: Gửi email (quên mật khẩu, xác nhận).
- **Google OAuth Client / API Client**: Login Google.
- **Cloudinary**: Lưu trữ hình ảnh & media.
- **Thanh toán**: Tích hợp VNĐ Payment Gateway (IPN) (cấu hình trong payment/ipn).

#### 🛠️ Tiện Ích & Khác
- **ModelMapper**: Mapping DTO <-> Entity.
- **Apache POI**: Export Excel (HSSF, XSSF).
- **Commons Lang3 / Commons Codec**: Xử lý tiện ích chuỗi, mã hóa.
- **dotenv-java**: Đọc config từ .env.

#### 🔗 Kết Nối FE – BE
- Giao tiếp qua RESTful API (JSON).
- Token lưu trong Cookie/LocalStorage (JWT).
- FE quản lý role/permission → BE cung cấp endpoint /role-permission.
- Thanh toán: BE xử lý VNĐ Payment Gateway (IPN callback).

## Screenshot
### Phía Client
- **Trang Home:**
  ![Home 1](./Img/c-h-1.png)
  ![Home 2](./Img/c-h-2.png)
  ![Home 3](./Img/c-h-3.png)
  ![Home 4](./Img/c-h-4.png)

- **Trang Sản Phẩm:**
  ![Products 1](./Img/c-p-5.png)
  ![Products 2](./Img/c-p-6.png)

- **Trang Blog:**
  ![Blog](./Img/c-b-7.png)

- **Trang Liên Hệ:**
  ![Contact](./Img/c-ct-8.png)

- **Trang Yêu Thích:**
  ![Wishlist](./Img/c-w-9.png)

- **Trang Chi Tiết Sản Phẩm:**
  ![Product Detail 1](./Img/c-pd-10.png)
  ![Product Detail 2](./Img/c-pd-11.png)
  ![Product Detail 3](./Img/c-pd-12.png)

- **Trang Giỏ Hàng:**
  ![Shopping Cart 1](./Img/c-sc-13.png)
  ![Shopping Cart 2](./Img/c-sc-14.png)

- **Quy Trình Đặt Hàng & Thanh Toán:**
  ![Checkout 1](./Img/c-co-15.png)
  ![Checkout 2](./Img/c-co-16.png)
  ![Checkout 3](./Img/c-co-17.png)
  ![Checkout 4](./Img/c-co-18.png)

- **Trang Xem Đơn Hàng:**
  ![Orders](./Img/c-o-19.png)

### Phía Admin (Dashboard)
- **Dashboard:**
  ![Dashboard 1](./Img/d-d-20.png)
  ![Dashboard 2](./Img/d-d-21.png)

- **Trang Log:**
  ![Logs](./Img/d-l-22.png)

- **Trang Người Dùng:**
  ![Users](./Img/d-u-23.png)

- **Trang Phân Quyền:**
  ![Permissions](./Img/d-p-24.png)

- **Trang Sản Phẩm:**
  ![Products](./Img/d-p-25.png)

- **Trang Phiên Bản Sản Phẩm:**
  ![Product Variants 1](./Img/d-pv-26.png)
  ![Product Variants 2](./Img/d-pv-27.png)

- **Trang Danh Mục:**
  ![Categories](./Img/d-c-28.png)

- **Trang Thương Hiệu:**
  ![Brands](./Img/d-b-29.png)

- **Trang Tag:**
  ![Tags](./Img/d-t-30.png)

- **Trang Màu Sắc:**
  ![Colors](./Img/d-c-31.png)

- **Trang Kích Thước:**
  ![Sizes](./Img/d-s-32.png)

- **Trang Đơn Hàng:**
  ![Orders 1](./Img/d-o-33.png)
  ![Orders 2](./Img/d-o-34.png)

- **Trang Discount:**
  ![Discounts](./Img/d-d-35.png)

- **Trang Blog:**
  ![Blog](./Img/d-b-36.png)

- **Trang Settings:**
  ![Settings](./Img/d-s-37.png)

## Đóng Góp
- Fork repository và tạo pull request.
- Báo issue nếu phát hiện bug.
- Tuân thủ code style (ESLint cho FE, Checkstyle cho BE).

## Liên Hệ
- Email: [nhut2846@gmail.com]

Cảm ơn bạn đã quan tâm đến dự án Moe! 🚀