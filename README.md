# Angle Online Store

A full-stack e-commerce ordering system built for **Angle Clothing Store** — a Philippine-based clothing brand offering Men, Women, Shorts, and Striped Shirts collections.

**Live Admin Panel:** [angle-online-store-admin.vercel.app](https://angle-online-store-admin.vercel.app/)

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend & Admin | React.js, Vite, Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express.js, Sequelize, MySQL |
| Cloud Storage | Cloudinary |
| Authentication | JSON Web Tokens (JWT) |
| Email | Nodemailer via Gmail |

---


## Features

### Customer Storefront
- Browse products by category
- Product detail with size selection and multiple images
- Shopping cart and wishlist
- Account registration with email OTP verification
- Login and forgot password via email OTP
- Place orders using Cash on Delivery
- View order history and cancel items

### Admin Panel
- Secure login
- Add, update, and remove products with up to 4 images
- Manage and update order statuses
- View and remove registered users

---

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL v8+
- Cloudinary account
- Gmail account with App Password enabled


> Database tables are created automatically on first server startup. No manual migration needed.

---

## Security

- `.env` files are git-ignored and must be set up locally on each machine
- Passwords are hashed using bcrypt before storage
- All sensitive routes are protected with JWT middleware
- OTP verification codes expire after 15 minutes
- Image uploads use in-memory buffers — no files are written to disk
- Admin and user authentication are handled by separate middleware layers

---