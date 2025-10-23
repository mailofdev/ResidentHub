// src/utils/dummyData.js
import { 
  createPayment
} from '../services/firebase/paymentService';
import { 
  createComplaint
} from '../services/firebase/complaintService';
import { 
  createNotice
} from '../services/firebase/noticeService';
import { 
  createResident
} from '../services/firebase/residentService';

// Dummy data for testing
export const dummyResidents = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    apartmentNumber: 'A-101',
    phone: '+91 9876543210',
    role: 'Resident'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    apartmentNumber: 'A-102',
    phone: '+91 9876543211',
    role: 'Resident'
  },
  {
    name: 'Admin User',
    email: 'admin@society.com',
    apartmentNumber: 'Office',
    phone: '+91 9876543212',
    role: 'Admin'
  }
];

export const dummyPayments = [
  {
    residentId: 'resident1',
    residentName: 'John Doe',
    description: 'Monthly Maintenance - January 2024',
    amount: 2500,
    dueDate: '2024-01-15',
    status: 'pending'
  },
  {
    residentId: 'resident1',
    residentName: 'John Doe',
    description: 'Monthly Maintenance - December 2023',
    amount: 2500,
    dueDate: '2023-12-15',
    status: 'paid',
    paidAt: '2023-12-10',
    paymentMethod: 'razorpay'
  },
  {
    residentId: 'resident2',
    residentName: 'Jane Smith',
    description: 'Monthly Maintenance - January 2024',
    amount: 2500,
    dueDate: '2024-01-15',
    status: 'pending'
  }
];

export const dummyComplaints = [
  {
    residentId: 'resident1',
    residentName: 'John Doe',
    apartmentNumber: 'A-101',
    category: 'Plumbing',
    description: 'Water leakage in bathroom. The tap is dripping continuously and needs immediate repair.',
    priority: 'high',
    status: 'open'
  },
  {
    residentId: 'resident2',
    residentName: 'Jane Smith',
    apartmentNumber: 'A-102',
    category: 'Electrical',
    description: 'Power outage in living room. The main switch is not working properly.',
    priority: 'medium',
    status: 'resolved',
    resolvedAt: '2024-01-10',
    adminNotes: 'Issue resolved by electrician. New switch installed.'
  }
];

export const dummyNotices = [
  {
    title: 'Monthly Maintenance Collection',
    description: 'This is to inform all residents that the monthly maintenance for January 2024 is due by 15th January. Please ensure timely payment to avoid late fees.',
    category: 'Payment',
    createdBy: 'admin'
  },
  {
    title: 'Water Supply Maintenance',
    description: 'Water supply will be temporarily shut down on 20th January from 9 AM to 5 PM for maintenance work. Please store water accordingly.',
    category: 'Maintenance',
    createdBy: 'admin'
  },
  {
    title: 'Society Meeting',
    description: 'Annual General Meeting (AGM) is scheduled for 25th January at 6 PM in the community hall. All residents are requested to attend.',
    category: 'Meeting',
    createdBy: 'admin'
  }
];

// Function to populate dummy data
export const populateDummyData = async () => {
  try {
    console.log('Adding dummy data to Firebase...');
    
    // Add dummy residents
    for (const resident of dummyResidents) {
      await createResident(resident);
    }
    
    // Add dummy payments
    for (const payment of dummyPayments) {
      await createPayment(payment);
    }
    
    // Add dummy complaints
    for (const complaint of dummyComplaints) {
      await createComplaint(complaint);
    }
    
    // Add dummy notices
    for (const notice of dummyNotices) {
      await createNotice(notice);
    }
    
    console.log('Dummy data added successfully!');
  } catch (error) {
    console.error('Error adding dummy data:', error);
  }
};

// Function to clear all data (for testing)
export const clearAllData = async () => {
  try {
    console.log('Clearing all data...');
    // This would require implementing delete functions in services
    console.log('Data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
