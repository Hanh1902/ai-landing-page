# AI Landing Page + Blog

Trang web giới thiệu về Trí Tuệ Nhân Tạo (AI) kết hợp hệ thống blog với quản lý bài viết, bình luận và đăng ký nhận tin.

## Tech Stack

| Phần | Công nghệ |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18, TypeScript, Tailwind CSS 3.4 |
| Backend | Supabase (PostgreSQL + Auth + REST API) |
| Hosting | Vercel (hoặc bất kỳ platform hỗ trợ Next.js) |

> Không có backend truyền thống — toàn bộ data và auth được xử lý qua Supabase.

## Cấu trúc

```
frontend-next/
├── src/
│   ├── app/
│   │   ├── page.tsx                        ← Landing page (hero, features, newsletter)
│   │   ├── login/page.tsx                  ← Đăng nhập (email/password)
│   │   ├── articles/page.tsx               ← Danh sách bài viết
│   │   ├── articles/[id]/page.tsx          ← Chi tiết bài viết + bình luận
│   │   ├── admin/page.tsx                  ← Admin dashboard (thống kê)
│   │   ├── admin/articles/new/page.tsx     ← Tạo bài viết mới
│   │   ├── admin/articles/edit/[id]/page.tsx ← Sửa bài viết
│   │   ├── layout.tsx                      ← Root layout + animated background
│   │   └── globals.css                     ← Custom animations & styles
│   ├── components/
│   │   └── Navbar.tsx                      ← Navigation responsive + role-based
│   └── lib/
│       ├── supabase.ts                     ← Supabase client initialization
│       ├── auth.ts                         ← Kiểm tra role (admin/user)
│       └── api.ts                          ← REST API calls tới Supabase
├── .env.local                              ← Biến môi trường (Supabase credentials)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Database (Supabase)

| Table | Mô tả |
|---|---|
| `articles` | id, title, summary, content, author_id, created_at |
| `comments` | id, article_id, author_name, content, created_at |
| `profiles` | id, role (user / admin) |
| `subscribers` | email |

## Tính năng

- **Landing page** — Hero section, giới thiệu features, thống kê, đăng ký newsletter
- **Blog** — Xem danh sách bài viết, chi tiết bài viết, bình luận
- **Auth** — Đăng nhập email/password qua Supabase Auth
- **Role-based access** — Admin có thể tạo/sửa/xóa bài viết, user chỉ xem
- **Admin Dashboard** — Thống kê số bài viết, bình luận, subscribers
- **Comments** — Ai cũng có thể bình luận, admin có thể xóa
- **Newsletter** — Đăng ký email nhận tin
- **UI** — Dark theme, glass morphism, animated backgrounds, responsive

## Chạy project

### 1. Cài dependencies

```bash
cd frontend-next
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env.local` trong `frontend-next/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Chạy dev server

```bash
npm run dev
```

Mở `http://localhost:3000`

## Auth Flow

1. User đăng nhập tại `/login` với email + password
2. Supabase Auth tạo session (JWT)
3. App fetch role từ bảng `profiles`
4. Nếu role = `admin` → hiển thị menu Admin, cho phép CRUD bài viết
5. Nếu role = `user` hoặc chưa đăng nhập → chỉ xem

## Scripts

```bash
npm run dev      # Chạy dev server
npm run build    # Build production
npm run start    # Chạy production server
npm run lint     # Kiểm tra code style
```
