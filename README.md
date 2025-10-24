# ResidentHub - Apartment Maintenance Tracker PWA

A comprehensive Progressive Web App (PWA) for housing societies to manage maintenance dues, complaints, residents, and notices. Built with React, Redux Toolkit, Firebase, and Bootstrap + Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Role-based Authentication** (Admin/Resident)
- **Maintenance Dues Management** with CRUD operations
- **Complaints System** with real-time updates
- **Residents Management** (Admin only)
- **Notices & Announcements**
- **Settings Management** for society details
- **Real-time Data Sync** with Firebase Firestore

### PWA Capabilities
- **Offline Support** with service worker caching
- **Install Prompt** for mobile app-like experience
- **Push Notifications** for updates
- **Responsive Design** optimized for mobile and desktop
- **Dark/Light Theme** toggle with persistence

### Technical Features
- **Redux Toolkit** for state management
- **Firebase Integration** (Auth, Firestore, Storage, Functions)
- **Real-time Listeners** for live data updates
- **CSV Export** functionality for reports
- **Mobile-first Design** with bottom navigation
- **Accessibility** features and keyboard navigation

## 🛠️ Tech Stack

- **Frontend**: React 19, Redux Toolkit, React Router
- **Styling**: Bootstrap 5, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **PWA**: Service Worker, Web App Manifest
- **Icons**: Bootstrap Icons
- **Build Tool**: Create React App

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ResidentHub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage
3. Update `src/config/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Firestore Security Rules
Set up the following Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Maintenance records
    match /maintenanceRecords/{recordId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource.data.residentId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Complaints
    match /complaints/{complaintId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource.data.residentId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Settings (admin only)
    match /settings/{settingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5. Run the Application
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (LoadingSpinner, etc.)
│   ├── layout/          # Layout components (Topbar, Sidebar, etc.)
│   └── display/         # Display components (ThemeToggle, etc.)
├── features/            # Feature-based modules
│   └── societyCare/     # Main application features
│       ├── auth/        # Authentication
│       ├── dashboard/   # Dashboard components
│       ├── maintenance/ # Maintenance management
│       ├── complaints/  # Complaints system
│       ├── residents/   # Residents management
│       ├── settings/    # Settings management
│       └── ...
├── services/            # Firebase services
├── utils/               # Utility functions
├── redux/               # Redux store configuration
└── config/              # Configuration files
```

## 🔐 User Roles

### Admin
- Manage all residents
- Create/edit maintenance records
- Handle complaints
- Manage society settings
- Export reports
- Access admin dashboard

### Resident
- View personal maintenance dues
- Submit complaints
- View notices
- Update profile
- Access resident dashboard

## 📱 PWA Features

### Installation
- **Desktop**: Click the install button in the address bar
- **Mobile**: Use "Add to Home Screen" option
- **Automatic Prompt**: App shows install prompt when criteria are met

### Offline Support
- **Cached Data**: View previously loaded data when offline
- **Service Worker**: Handles caching and background sync
- **Offline Page**: Custom offline experience
- **Sync on Reconnect**: Automatic data sync when back online

### Push Notifications
- Maintenance due reminders
- Complaint status updates
- New notices and announcements
- Payment confirmations

## 🎨 Theming

The app supports both light and dark themes:
- **Theme Toggle**: Available in the top navigation
- **Persistence**: Theme preference saved in Firebase and localStorage
- **System Preference**: Respects user's system theme preference
- **Custom Colors**: Configurable primary and secondary colors

## 📊 Data Management

### Real-time Updates
- **Firestore Listeners**: Live data updates across all clients
- **Optimistic Updates**: Immediate UI updates for better UX
- **Conflict Resolution**: Handles concurrent edits gracefully

### Offline Support
- **Local Caching**: Critical data cached for offline access
- **Background Sync**: Queued actions sync when online
- **Data Persistence**: Redux state persisted in localStorage

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Configure environment variables in Vercel dashboard

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Run: `firebase login`
3. Run: `firebase init hosting`
4. Run: `firebase deploy`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### PWA Configuration
Update `public/manifest.json` for custom PWA settings:
- App name and description
- Icons and theme colors
- Display mode and orientation
- Shortcuts and categories

## 📈 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching Strategy**: Efficient service worker caching
- **Lazy Loading**: Components loaded on demand

### Monitoring
- **Web Vitals**: Core Web Vitals tracking
- **Error Boundaries**: Graceful error handling
- **Performance Metrics**: Built-in performance monitoring

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Testing
```bash
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Core PWA functionality
- Maintenance management
- Complaints system
- Real-time updates
- Offline support
- Dark/light theme

## 🎯 Roadmap

### Upcoming Features
- [ ] Advanced reporting and analytics
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced notification system
- [ ] Document management
- [ ] Meeting scheduler
- [ ] Expense tracking
- [ ] Visitor management

---

**ResidentHub** - Making apartment management simple and efficient! 🏢✨