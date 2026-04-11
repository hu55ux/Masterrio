[masterrio_readme.md](https://github.com/user-attachments/files/26632554/masterrio_readme.md)
# 🔨 Masterrio

**Premium Freelance Marketplace** — A modern, full-stack platform connecting skilled **Masters** (professionals) with **Clients** who need work done. Built with Clean Architecture on the backend and a stunning glassmorphism UI on the frontend.

---

## ✨ Key Features

### 🏪 Marketplace
- **Job Posting System** — Clients create jobs with title, description, budget, and required skill
- **Advanced Filtering** — Status tabs (All, Active, Pending, Completed, In Progress, Canceled)
- **Server-Side Pagination** — High-performance paged loading with "Load More"
- **Debounced Search** — 500ms optimized global search across all jobs

### ⭐ Ultra-Precise Rating System (0.1 Accuracy)
- **Granular Reviews** — Rate masters from 0.1 to 5.0 with pixel-perfect star fill
- **CRUD Operations** — Create, edit, and delete your own reviews
- **Visual Feedback** — Percentage-based star rendering with gradient fills
- **Review Management** — Integrated edit/delete controls on user-owned reviews

### 👤 User Profiles
- **Role-Based Access** — Master, Client, and Admin roles with distinct capabilities
- **Master Profiles** — Skills, experience, average rating, and customer reviews
- **Client Profiles** — Job history and profile information
- **Interactive Directory** — Browse Masters (for Clients) and Clients (for Masters)

### 🌍 Multi-Language Support
- **3 Languages** — Azerbaijani (az), English (en), Russian (ru)
- **Auto-Detection** — Browser language detection with persistence
- **Premium Switcher** — Glassmorphism-styled language selector in Navbar

### 🎨 Premium UI/UX
- **Dark/Light Mode** — Seamless theme switching with smooth transitions
- **Custom Cursor** — Branded hammer cursor with swing animation and industrial sparks
- **Page Transitions** — Fade + slide-up animations between route changes
- **Glassmorphism Design** — Backdrop blur, gradient accents, and premium shadows
- **Animated 404 Page** — "This page not borned" with 5-second auto-redirect
- **Hover Effects** — Indigo glow, gradient accent bars, and micro-animations

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2 | UI Framework |
| **Vite** | 8.0 | Build Tool & Dev Server |
| **Tailwind CSS** | 4.2 | Utility-First CSS Framework |
| **Zustand** | 5.0 | Lightweight State Management |
| **React Router** | 7.13 | Client-Side Routing |
| **Axios** | 1.13 | HTTP Client |
| **i18next** | 26.0 | Internationalization |

### Backend
| Technology | Purpose |
|---|---|
| **ASP.NET Core** | Web API Framework |
| **MediatR** | CQRS Pattern Implementation |
| **Entity Framework Core** | ORM / Data Access |
| **Clean Architecture** | Layered Project Structure |

---

## 📁 Project Structure

```
Masterrio/
├── src/
│   ├── components/
│   │   ├── ConfirmModal/        # Reusable confirmation dialog
│   │   ├── CustomCursor/        # Branded hammer cursor with animations
│   │   ├── Footer/              # Role-aware footer with quick links
│   │   ├── JobPostCard/         # Premium job listing card with expandable details
│   │   ├── Login/               # Authentication form
│   │   ├── Navbar/              # Responsive navbar with role-based navigation
│   │   ├── PageTransition/      # Route change animation wrapper
│   │   ├── RatingModal/         # 0.1-precision star rating input modal
│   │   ├── RatingStars/         # Reusable percentage-based star display
│   │   ├── Register/            # Multi-step registration form
│   │   ├── SkillCard/           # Skill tag display component
│   │   ├── UserCard/            # User directory card with hover glow
│   │   └── UserProfileCard/     # Profile header component
│   ├── locales/
│   │   ├── az.json              # Azerbaijani translations
│   │   ├── en.json              # English translations
│   │   └── ru.json              # Russian translations
│   ├── pages/
│   │   ├── Catalog/
│   │   │   ├── Masters.jsx      # Masters directory (for Clients/Admins)
│   │   │   └── Clients.jsx      # Clients directory (for Masters/Admins)
│   │   ├── AllJobs.jsx          # Main marketplace with filters & search
│   │   ├── CreateJobPost.jsx    # Job creation form
│   │   ├── JobDetail.jsx        # Single job detail page
│   │   ├── MyProfile.jsx        # Authenticated user's own profile
│   │   ├── NotFound.jsx         # Animated 404 with auto-redirect
│   │   └── UserProfile.jsx      # Public user profile with reviews
│   ├── stores/
│   │   ├── useDarkmode.js       # Dark mode toggle state
│   │   └── useTokens.js         # Auth tokens & role management
│   ├── utils/
│   │   └── axiosInstance.js     # Configured Axios with interceptors
│   ├── App.jsx                  # Main app with routing & layout
│   ├── index.css                # Global styles & animations
│   └── main.jsx                 # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+
- Backend API running on `localhost:5071`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/masterrio.git

# Navigate to the frontend directory
cd masterrio/Masterrio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Role-Based Access

| Feature | Client | Master | Admin |
|---|:---:|:---:|:---:|
| Browse Jobs | ✅ | ✅ | ✅ |
| Post a Job | ✅ | ❌ | ✅ |
| Browse Masters | ✅ | ❌ | ✅ |
| Browse Clients | ❌ | ✅ | ✅ |
| Rate Masters | ✅ | ❌ | ✅ |
| View Profiles | ✅ | ✅ | ✅ |
| Edit Own Profile | ✅ | ✅ | ✅ |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Auth/login` | User authentication |
| `POST` | `/api/Auth/register` | User registration |
| `POST` | `/api/Auth/details` | Get user by ID (secure POST body) |
| `GET` | `/api/Auth/masters` | List all masters (paginated) |
| `GET` | `/api/Auth/clients` | List all clients (paginated) |
| `GET` | `/api/JobPost` | List all jobs (paginated, filterable) |
| `POST` | `/api/JobPost` | Create a new job post |
| `GET` | `/api/MasterRating/{id}` | Get ratings for a master |
| `POST` | `/api/MasterRating` | Submit a new rating |
| `PUT` | `/api/MasterRating` | Update an existing rating |
| `DELETE` | `/api/MasterRating/{masterId}/{customerId}` | Delete a rating |

---

## 📄 License

This project is private and proprietary.

---

<p align="center">
  Built with ❤️ by the <strong>Masterrio</strong> Team
</p>
