# Auctra - Premium Online Auction Platform

**Auctra** is a modern, feature-rich online auction platform built with **Next.js 15**, **TypeScript**, **MongoDB**, and **NextAuth.js**. Designed for collectors, creators, and enthusiasts, Auctra provides a seamless bidding experience with real-time updates, secure authentication, and powerful admin controls.

Whether you're a buyer hunting for unique treasures, a seller showcasing your collection, or an admin managing the platform, Auctra offers a complete solution for online auctions.

---

## Key Features

### Core Auction Features

- **Live Auctions**: Browse and bid on active auctions in real-time
- **Smart Bidding System**: Automatic minimum bid calculations with bid increment validation
- **Real-Time Updates**: Live auction data updates every 10 seconds
- **Outbid Notifications**: Get instant alerts when someone outbids you
- **Buy Now Option**: Skip bidding and purchase items instantly at a fixed price
- **Auction Status Tracking**: Active, pending, ended, and cancelled states
- **Reserve Price Protection**: Sellers can set minimum acceptable prices
- **Automatic Auction Completion**: Cron jobs automatically close ended auctions and determine winners

### User Experience

- **Personalized Dashboard**: Track your bids, won auctions, and selling activity
- **Favorites System**: Save auctions to your wishlist for quick access
- **Category Browsing**: Filter auctions by categories (Fine Art, Jewelry, Watches, etc.)
- **Advanced Search**: Find specific items with smart filtering
- **Upcoming Events**: Preview auctions that haven't started yet
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Switch between light and dark themes

### Authentication & Security

- **Secure Login**: Email/password authentication powered by NextAuth.js
- **JWT-Based Sessions**: Token-based authentication stored in secure HTTP-only cookies
- **Role-Based Access**: Separate permissions for buyers, sellers, admins, and experts
- **Middleware Protection**: Automatic route guarding for protected pages
- **Security Headers**: Enhanced protection against XSS, clickjacking, and MIME sniffing
- **Session Management**: Persistent login with automatic token refresh

### Admin Panel

- **Comprehensive Dashboard**: View platform analytics, user stats, and auction metrics
- **User Management**: Delete users, activate/deactivate accounts, view user details
- **Auction Management**: Delete auctions, modify status (active/pending/closed/cancelled)
- **Platform Analytics**: Track total users, active auctions, bids, and revenue trends
- **Search & Filter**: Quickly find specific users or auctions
- **Bulk Operations**: Efficient management of multiple records
- **Admin Setup**: Easy admin account creation and role assignment

### Seller Features

- **Consignment System**: List items for auction with detailed descriptions
- **Image Upload**: Showcase items with multiple high-quality images
- **Pricing Control**: Set starting prices, reserve prices, and buy-now prices
- **Auction Scheduling**: Set start and end times for your auctions
- **Seller Dashboard**: Track your active listings and sales history
- **Performance Stats**: View your rating, total sales, and successful transactions

### Advanced Features

- **Real-Time Bid History**: Live feed of all bids with timestamps and bidder info
- **Auction Stats Display**: See starting bid, current bid, total bidders, and time remaining
- **Seller Profiles**: View seller ratings, sales history, and verification status
- **Shipping Information**: Transparent shipping costs and delivery estimates
- **Condition Reporting**: Detailed item condition descriptions
- **Provenance Tracking**: Historical ownership and authenticity documentation

---

## How It Works

### For Buyers:

1. **Sign Up/Sign In**: Create an account or log in with existing credentials
2. **Browse Auctions**: Explore active auctions by category or search
3. **Add to Favorites**: Save interesting items to your wishlist
4. **Place Bids**: Enter your bid amount (must meet minimum increment)
5. **Get Notifications**: Receive alerts if you're outbid
6. **Win Auctions**: Highest bidder when time expires wins (if reserve met)
7. **Buy Now (Optional)**: Purchase instantly at a fixed price
8. **Track Activity**: View your bids and won auctions in your dashboard

### For Sellers:

1. **Register as Seller**: Create a seller account and get verified
2. **Create Listing**: Add item details, images, and pricing
3. **Set Auction Parameters**: Choose start/end times, reserve price, buy-now option
4. **Publish Auction**: Submit for approval or go live immediately
5. **Monitor Bids**: Track bidding activity in real-time
6. **Complete Sale**: Ship item to winner after auction closes
7. **Get Paid**: Receive payment through the platform

### For Admins:

1. **Access Admin Panel**: Navigate to `/admin` with admin credentials
2. **View Analytics**: Monitor platform health with real-time metrics
3. **Manage Users**: Approve, suspend, or delete user accounts
4. **Manage Auctions**: Review, approve, or remove auction listings
5. **Handle Disputes**: Resolve issues between buyers and sellers
6. **Generate Reports**: Export data for analysis
7. **System Maintenance**: Run cron jobs, seed data, or perform backups

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js (Auth.js) with JWT strategy
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Real-Time Updates**: Custom hooks with polling mechanism
- **State Management**: React hooks (useState, useEffect, useContext)
- **API Routes**: Next.js API Routes (RESTful architecture)
- **Middleware**: Next.js Middleware for route protection
- **Deployment**: Vercel (recommended)

---

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or cloud, e.g., MongoDB Atlas)
- Environment variables configured

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/rezwanahammad/Auctra.git
   cd auctra
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/auctra
   # or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auctra

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-random-string-at-least-32-chars

   # Cron Job (for automated auction completion)
   CRON_SECRET=your-cron-job-secret-key
   ```

4. **Seed the database (optional)**

   ```bash
   npx ts-node src/scripts/seed.ts
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

7. **Create an admin account**
   - Visit `/admin/setup` to create your first admin account
   - Or use the admin test page at `/admin-setup.html`

---

## Key Pages & Routes

### Public Routes

- `/` - Homepage with featured auctions and categories
- `/auctions` - Browse all active auctions
- `/auctions/[id]` - Individual auction detail page
- `/category/[slug]` - Category-specific auction listings
- `/events` - Upcoming auctions (not started yet)
- `/about` - About the platform
- `/stories` - Success stories and testimonials

### Protected Routes (Requires Login)

- `/dashboard` - User dashboard with bids and won auctions
- `/favorites` - Saved/favorited auctions
- `/sell` - Create new auction listing (sellers only)

### Admin Routes (Requires Admin Role)

- `/admin` - Admin dashboard with analytics
- `/admin/manage` - Comprehensive user/auction management
- `/admin/setup` - Initial admin account setup

### Auth Routes

- `/auth/signin` - Sign in page
- `/auth/register` - Create new account

---

## API Endpoints

### Auctions

- `GET /api/auctions` - Fetch all auctions
- `GET /api/auctions/[id]` - Get single auction details
- `POST /api/auctions/[id]/bid` - Place a bid
- `POST /api/auctions/[id]/buy` - Buy now
- `GET /api/auctions/won` - Get user's won auctions

### Admin

- `GET /api/admin/analytics` - Platform statistics
- `GET /api/admin/users` - List users
- `PATCH /api/admin/users` - Update user
- `DELETE /api/admin/delete-user` - Delete user
- `GET /api/admin/auctions` - List auctions
- `PATCH /api/admin/auctions` - Update auction
- `DELETE /api/admin/auctions` - Delete auction
- `POST /api/admin/make-admin` - Promote user to admin
- `POST /api/admin/create-sample-data` - Generate test data

### Favorites

- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Remove from favorites

### Cron Jobs

- `POST /api/cron/complete-auctions` - Auto-close ended auctions (scheduled task)

---

## Special Features

### 1. **Real-Time Auction Updates**

The platform uses a custom `useRealTimeAuction` hook that polls the server every 10 seconds, ensuring users always see the latest bid amounts, bidder counts, and auction status without manual refresh.

### 2. **Outbid Notification System**

The `useOutbidNotification` hook tracks when users are outbid and displays toast notifications, encouraging re-engagement and competitive bidding.

### 3. **Smart Bid Validation**

The system automatically calculates minimum bid increments based on current bid amounts, preventing invalid bids and ensuring fair competition.

### 4. **Middleware-Based Route Protection**

Custom Next.js middleware (`middleware.ts`) protects routes, enforces authentication, checks admin roles, and adds security headers—all before pages load.

### 5. **Automated Auction Completion**

A cron job API endpoint (`/api/cron/complete-auctions`) runs periodically to:

- Find auctions past their end time
- Determine the winner (highest bidder)
- Check if reserve price was met
- Update auction status to "ended"
- Update user stats (wins, sales)

### 6. **JWT-Based Session Management**

Uses NextAuth.js with JWT strategy for:

- Secure, encrypted tokens stored in HTTP-only cookies
- No database lookups on every request (faster)
- Custom user properties (id, role) via TypeScript declaration merging

### 7. **Admin Panel with Full CRUD**

A comprehensive admin dashboard allows platform owners to:

- View real-time analytics (users, auctions, bids)
- Delete or suspend users
- Modify auction statuses
- Search and filter records
- Export data for reporting

### 8. **Responsive Design**

Built with Tailwind CSS, the entire platform adapts to:

- User's system theme preference (dark/light mode)
- All screen sizes (mobile, tablet, desktop)
- Accessibility standards (WCAG compliant)

---

### Development

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

### Database

- `npx ts-node src/scripts/seed.ts` - Seed categories into the database

### Testing (if implemented)

- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

---

## Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.mjs` - ESLint rules
- `middleware.ts` - Route protection and security
- `.env.local` - Environment variables (not committed)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

**Rezwan Ahammad**

- GitHub: [@rezwanahammad](https://github.com/rezwanahammad)
- Project: [Auctra](https://github.com/rezwanahammad/Auctra)

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Authenticated with [NextAuth.js](https://next-auth.js.org/)
- Icons by [Lucide React](https://lucide.dev/)

---
