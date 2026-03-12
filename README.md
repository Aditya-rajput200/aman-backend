# Simple Backend for Portfolio

A simple Express.js backend with MongoDB and Cloudinary to replace Supabase for the portfolio frontend.

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/portfolio_db
   PORT=3001
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Set up services:**
   - Make sure MongoDB is running on your system
   - Create a Cloudinary account and get your credentials
   - The backend will automatically create the database and collections on first run

4. **Start the server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project (JSON payload)
- `PUT /api/projects/:id` - Update project (JSON payload)
- `DELETE /api/projects/:id` - Delete project

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### About
- `GET /api/about` - Get about info
- `PUT /api/about` - Update about info (JSON payload)

### Contact
- `GET /api/contact` - Get all contact submissions
- `POST /api/contact` - Create contact submission
- `PUT /api/contact/:id/status` - Update submission status
- `DELETE /api/contact/:id` - Delete submission

### Auth
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get authenticated admin

## File Uploads

### Supported File Types
- **Images**: jpg, jpeg, png, gif, webp
- **Videos**: mp4, mov, avi, webm

### Upload Limits
- **Single file**: 10MB (thumbnails, about photo)
- **Multiple files**: 50MB per file, max 10 files
- **Storage**: All files are uploaded to Cloudinary and stored in `portfolio` folder

### Upload Endpoints
- `POST /api/cloudinary/single` - Upload a single file
- `POST /api/cloudinary/multiple` - Upload multiple files
- `POST /api/cloudinary/about-photo` - Upload about photo

## Database Schema

The backend automatically creates these MongoDB collections:

- `projects` - Portfolio projects
- `services` - Services offered
- `about` - About page information
- `contactsubmissions` - Contact form submissions
- `adminusers` - Admin user accounts

## Frontend Configuration

In the frontend, make sure to set the API URL environment variable:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Cloudinary Setup

1. Sign up for a Cloudinary account
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your `.env` file
4. Files will be automatically uploaded to your Cloudinary account

## Admin Login Credentials

Set admin credentials in `.env` and use them for login:
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
```

## MongoDB vs MySQL Changes

- **IDs**: MongoDB uses `_id` (ObjectId) instead of `id` (integer)
- **Dates**: MongoDB automatically adds `createdAt` and `updatedAt` fields
- **Arrays**: MongoDB natively supports arrays for `video_urls`, `images`, and `features`
- **Querying**: Uses Mongoose methods instead of SQL queries
- **File Storage**: Cloudinary instead of local storage
