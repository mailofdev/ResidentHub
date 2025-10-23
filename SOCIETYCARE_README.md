# SocietyCare - Apartment Maintenance Tracker

A complete web application for housing societies to manage maintenance payments, complaints, and notices efficiently. Built with React.js, Firebase, and Bootstrap 5.

## 🚀 Features

### For Residents
- **Dashboard**: Overview of payments, complaints, and notices
- **Payment Management**: View pending dues and make payments online
- **Complaint System**: Raise complaints and track their status
- **Notice Board**: View society announcements and updates

### For Administrators
- **Admin Dashboard**: Manage residents, payments, and complaints
- **Resident Management**: Add, update, and manage resident information
- **Payment Tracking**: Monitor all payments and collections
- **Complaint Resolution**: Handle and resolve resident complaints
- **Notice Management**: Create and post society notices

## 🛠 Tech Stack

- **Frontend**: React.js 19.1.0 with functional components and hooks
- **UI Framework**: Bootstrap 5.3.7 with custom ResidentHub theme
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Firestore + Authentication)
- **Payments**: Razorpay integration (with mock implementation)
- **Routing**: React Router DOM 7.7.0

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ResidentHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - The Firebase configuration is already set up in `src/config/firebase.js`
   - The project uses the existing Firebase project: `residenthub-53d58`
   - Firestore and Authentication are enabled

4. **Environment Variables** (Optional)
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_here
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

## 🎯 Demo Accounts

The application includes demo accounts for testing:

### Admin Account
- **Email**: admin@society.com
- **Password**: admin123
- **Role**: Admin

### Resident Account
- **Email**: resident@society.com
- **Password**: resident123
- **Role**: Resident

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (Sidebar, Topbar, Footer)
│   ├── navigation/      # Navigation and routing
│   └── common/          # Common utilities
├── features/
│   ├── societyCare/     # SocietyCare feature modules
│   │   ├── auth/        # Authentication (login, register)
│   │   ├── dashboard/   # Resident and Admin dashboards
│   │   ├── payments/    # Payment management
│   │   ├── complaints/  # Complaint system
│   │   ├── notices/     # Notice board
│   │   └── residents/   # Resident management
│   └── [legacy features] # Original project features
├── services/
│   └── firebase/        # Firebase service files
├── redux/               # Redux store and reducers
├── styles/              # CSS and theme files
└── utils/               # Utility functions
```

## 🔧 Key Components

### Authentication
- **SocietyLoginForm**: Login with email/password
- **SocietyRegisterForm**: Registration with role selection
- **Role-based routing**: Different dashboards for Admin/Resident

### Dashboards
- **ResidentDashboard**: Overview of personal data
- **AdminDashboard**: Management overview with statistics

### Payment System
- **PaymentsPage**: View and pay maintenance dues
- **Razorpay Integration**: Mock payment processing
- **Real-time updates**: Firestore listeners for live data

### Complaint System
- **ComplaintsPage**: Raise and track complaints
- **Category-based**: Plumbing, Electrical, Security, etc.
- **Priority levels**: High, Medium, Low
- **Status tracking**: Open, In-progress, Resolved

### Notice Board
- **NoticesPage**: View society announcements
- **Real-time updates**: Live notice updates
- **Category filtering**: Different notice types

## 🎨 Theme & Styling

The application uses a custom ResidentHub theme with:
- **Primary Color**: Blue (#0d6efd)
- **Gradient Backgrounds**: Light blue gradients
- **Bootstrap 5**: Modern UI components
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Theme switching capability

## 🔥 Firebase Collections

The application uses the following Firestore collections:

- **users**: User profiles with roles and apartment details
- **payments**: Maintenance payment records
- **complaints**: Resident complaints and their status
- **notices**: Society announcements and notices
- **residents**: Resident information (admin use)

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Other Platforms
- **Vercel**: Connect GitHub repository
- **Netlify**: Drag and drop build folder
- **AWS S3**: Upload build files to S3 bucket

## 🔐 Security Features

- **Firebase Authentication**: Secure user authentication
- **Role-based Access**: Admin/Resident permission system
- **Protected Routes**: Authentication required for app access
- **Data Validation**: Form validation and error handling

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Bootstrap Grid**: Responsive layout system
- **Touch-friendly**: Large buttons and touch targets
- **Cross-browser**: Compatible with modern browsers

## 🧪 Testing

The application includes:
- **Demo Data**: Pre-populated test data
- **Mock Payments**: Simulated payment processing
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations

## 🔄 Real-time Features

- **Live Updates**: Firestore real-time listeners
- **Instant Notifications**: Real-time data synchronization
- **Offline Support**: Firebase offline capabilities
- **Auto-refresh**: Automatic data updates

## 📞 Support

For support or questions:
- Check the demo accounts for testing
- Review the Firebase console for data
- Use browser developer tools for debugging
- Check the console for error messages

## 🎉 Getting Started

1. **Start the app**: `npm start`
2. **Visit**: http://localhost:3000
3. **Login**: Use demo accounts or register new users
4. **Explore**: Navigate through different features
5. **Test**: Try creating payments, complaints, and notices

## 🔮 Future Enhancements

- **Real Razorpay Integration**: Replace mock payments
- **Push Notifications**: Real-time alerts
- **File Uploads**: Image attachments for complaints
- **Advanced Analytics**: Detailed reporting
- **Mobile App**: React Native version
- **Multi-language**: Internationalization support

---

**Built with ❤️ using React, Firebase, and Bootstrap**
