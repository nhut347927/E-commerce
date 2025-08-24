# E-commerce
website thương mại điện tử
🚀 Công nghệ sử dụng trong dự án Moe

Dự án Moe bao gồm 2 phần chính: Frontend (FE) và Backend (BE). Mỗi phần sử dụng các công nghệ, thư viện và framework hiện đại để đảm bảo hiệu suất, khả năng mở rộng và trải nghiệm người dùng tốt.

🖥️ Frontend (FE)
⚙️ Framework & Công cụ chính

React 18 → Thư viện UI chính.

Vite 5 → Bundler thế hệ mới, tốc độ build & HMR siêu nhanh.

TypeScript 5.6 → Static typing, nâng cao tính an toàn và maintainable code.

TailwindCSS 3.4 + tailwind-merge + tailwindcss-animate → Utility-first CSS framework, kèm plugin merge class và animation tiện dụng.

Radix UI (Accordion, Dialog, Dropdown, Tabs, Tooltip, …) → Component headless, dễ tùy biến.

Framer Motion → Animation mượt mà, hỗ trợ UI/UX cao cấp.

lucide-react → Bộ icon hiện đại, nhẹ.

📦 State management & Data fetching

Redux Toolkit + React Redux → Quản lý state tập trung, boilerplate tối giản.

React Hook Form + @hookform/resolvers → Quản lý form mạnh mẽ, dễ validate.

Zod → Schema validation cho form & API.

Axios → HTTP client chính, dễ quản lý request/response.

React Router v6 → Routing SPA.

🎨 UI/UX & tiện ích khác

next-themes → Dark mode & theme switcher.

react-dropzone → Upload drag & drop.

date-fns → Xử lý thời gian.

react-responsive → Responsive design detection.

recharts → Vẽ biểu đồ/thống kê.

vite-plugin-pwa → Progressive Web App (offline, push notification).

lodash / clsx / class-variance-authority → Helper functions, quản lý className linh hoạt.

🛠️ Dev Tools

ESLint 9 + typescript-eslint → Code linting.

@vitejs/plugin-react-swc → Compiler React bằng SWC (cực nhanh).

PostCSS + Autoprefixer → Tối ưu CSS.

⚙️ Backend (BE)
🏗️ Framework & Cấu hình

Spring Boot 3.3.4 → Framework backend chính.

Java 17 → Ngôn ngữ chính.

Maven → Quản lý dependency & build tool.

Spring Boot DevTools → Hỗ trợ hot reload khi dev.

📊 Database & ORM

Spring Data JPA (Hibernate) → ORM mapping entity.

MySQL → Database chính (production).

H2 Database → Database in-memory cho test.

🔐 Bảo mật & Xác thực

Spring Security → Authentication & Authorization.

JWT (jjwt-api, jjwt-impl, jjwt-jackson) → Xác thực bằng JSON Web Token.

BCrypt / Commons Codec → Hash password, xử lý bảo mật.

📬 Tích hợp & Dịch vụ ngoài

Spring Mail → Gửi email (quên mật khẩu, xác nhận).

Google OAuth Client / API Client → Login Google.

Cloudinary → Lưu trữ hình ảnh & media.

Thanh toán → Tích hợp VNĐ Payment Gateway (IPN) (cấu hình trong payment/ipn).

🛠️ Tiện ích & Khác

ModelMapper → Mapping DTO <-> Entity.

Apache POI → Export Excel (HSSF, XSSF).

Commons Lang3 / Commons Codec → Xử lý tiện ích chuỗi, mã hóa.

dotenv-java → Đọc config từ .env.

🔗 Kết nối FE – BE

Giao tiếp qua RESTful API (JSON).

Token lưu trong Cookie/LocalStorage (JWT).

FE quản lý role/permission → BE cung cấp endpoint /role-permission.

Thanh toán: BE xử lý VNĐ Payment Gateway (IPN callback).


# AnAn chup caá trang va mo  ta
...
