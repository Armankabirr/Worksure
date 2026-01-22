import { Booking, BookingStats } from '@/types/booking';

export const mockBookings: Booking[] = [
  {
    id: '1',
    bookingNumber: 'BK-2026-0001',
    user: {
      id: 'u1',
      name: 'Rahul Ahmed',
      phone: '+880 1712-345678',
      email: 'rahul@example.com',
      rating: 4.5,
      address: 'House 23, Road 5, Dhanmondi, Dhaka',
      location: { lat: 23.7461, lng: 90.3742 }
    },
    worker: {
      id: 'w1',
      name: 'Karim Khan',
      phone: '+880 1823-456789',
      verified: true,
      rating: 4.8,
      completedJobs: 145,
      specialization: ['AC Repair', 'AC Installation', 'AC Maintenance']
    },
    serviceCategory: 'ac-doctor',
    serviceSection: 'AC Repair',
    serviceName: 'Split AC Gas Refill',
    scheduledDate: '2026-01-25',
    scheduledTime: '10:00 AM',
    status: 'accepted',
    paymentStatus: 'paid',
    paymentMethod: 'bkash',
    transactionId: 'TRX20260122001',
    totalAmount: 1500,
    createdAt: '2026-01-22T08:30:00Z',
    updatedAt: '2026-01-22T09:15:00Z',
    adminNotes: 'Customer requested morning slot',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-22T08:30:00Z' },
      { status: 'accepted', timestamp: '2026-01-22T09:15:00Z', note: 'Worker accepted the booking' }
    ]
  },
  {
    id: '2',
    bookingNumber: 'BK-2026-0002',
    user: {
      id: 'u2',
      name: 'Fatima Sultana',
      phone: '+880 1912-345678',
      email: 'fatima@example.com',
      rating: 4.2,
      address: 'Flat 4B, Gulshan-2, Dhaka',
      location: { lat: 23.7925, lng: 90.4078 }
    },
    worker: {
      id: 'w2',
      name: 'Rahim Mia',
      phone: '+880 1734-567890',
      verified: true,
      rating: 4.6,
      completedJobs: 98,
      specialization: ['House Cleaning', 'Deep Cleaning', 'Office Cleaning']
    },
    serviceCategory: 'cleaning',
    serviceSection: 'Deep Cleaning',
    serviceName: '3 BHK Deep Cleaning',
    scheduledDate: '2026-01-23',
    scheduledTime: '2:00 PM',
    status: 'ongoing',
    paymentStatus: 'paid',
    paymentMethod: 'nagad',
    transactionId: 'TRX20260122002',
    totalAmount: 2800,
    createdAt: '2026-01-21T14:20:00Z',
    updatedAt: '2026-01-23T14:00:00Z',
    adminNotes: '',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-21T14:20:00Z' },
      { status: 'accepted', timestamp: '2026-01-21T15:00:00Z' },
      { status: 'ongoing', timestamp: '2026-01-23T14:00:00Z', note: 'Service started' }
    ]
  },
  {
    id: '3',
    bookingNumber: 'BK-2026-0003',
    user: {
      id: 'u3',
      name: 'Tanvir Hasan',
      phone: '+880 1612-345678',
      email: 'tanvir@example.com',
      rating: 4.7,
      address: 'House 45, Banani, Dhaka',
      location: { lat: 23.7937, lng: 90.4066 }
    },
    worker: {
      id: 'w3',
      name: 'Shakil Ahmed',
      phone: '+880 1845-678901',
      verified: true,
      rating: 4.9,
      completedJobs: 234,
      specialization: ['Electrical Wiring', 'Circuit Breaker', 'Fan Installation']
    },
    serviceCategory: 'electrician',
    serviceSection: 'Electrical Repairs',
    serviceName: 'Circuit Breaker Replacement',
    scheduledDate: '2026-01-24',
    scheduledTime: '11:00 AM',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    transactionId: 'TRX20260120003',
    totalAmount: 1200,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-24T13:30:00Z',
    adminNotes: 'Completed successfully',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-20T10:00:00Z' },
      { status: 'accepted', timestamp: '2026-01-20T11:00:00Z' },
      { status: 'ongoing', timestamp: '2026-01-24T11:00:00Z' },
      { status: 'completed', timestamp: '2026-01-24T13:30:00Z', note: 'Job completed successfully' }
    ]
  },
  {
    id: '4',
    bookingNumber: 'BK-2026-0004',
    user: {
      id: 'u4',
      name: 'Nasrin Akter',
      phone: '+880 1512-345678',
      email: 'nasrin@example.com',
      rating: 4.0,
      address: 'Mohammadpur, Housing Estate, Dhaka',
      location: { lat: 23.7679, lng: 90.3619 }
    },
    worker: null,
    serviceCategory: 'plumbing',
    serviceSection: 'Pipe Repair',
    serviceName: 'Water Leakage Fixing',
    scheduledDate: '2026-01-26',
    scheduledTime: '9:00 AM',
    status: 'pending',
    paymentStatus: 'unpaid',
    totalAmount: 800,
    createdAt: '2026-01-22T11:45:00Z',
    updatedAt: '2026-01-22T11:45:00Z',
    adminNotes: 'Urgent - customer needs worker assignment',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-22T11:45:00Z', note: 'Awaiting worker assignment' }
    ]
  },
  {
    id: '5',
    bookingNumber: 'BK-2026-0005',
    user: {
      id: 'u5',
      name: 'Shakib Rahman',
      phone: '+880 1712-987654',
      email: 'shakib@example.com',
      rating: 4.8,
      address: 'Uttara Sector 7, Dhaka',
      location: { lat: 23.8759, lng: 90.3795 }
    },
    worker: {
      id: 'w4',
      name: 'Sultana Begum',
      phone: '+880 1923-456789',
      verified: true,
      rating: 4.7,
      completedJobs: 67,
      specialization: ['Infant Care', 'Toddler Care', 'Overnight Care']
    },
    serviceCategory: 'babysitting',
    serviceSection: 'Infant Care',
    serviceName: 'Full Day Babysitting',
    scheduledDate: '2026-01-27',
    scheduledTime: '8:00 AM',
    status: 'accepted',
    paymentStatus: 'paid',
    paymentMethod: 'bkash',
    transactionId: 'TRX20260122005',
    totalAmount: 1800,
    createdAt: '2026-01-22T07:00:00Z',
    updatedAt: '2026-01-22T08:00:00Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-22T07:00:00Z' },
      { status: 'accepted', timestamp: '2026-01-22T08:00:00Z' }
    ]
  },
  {
    id: '6',
    bookingNumber: 'BK-2026-0006',
    user: {
      id: 'u6',
      name: 'Meher Afroz',
      phone: '+880 1612-876543',
      email: 'meher@example.com',
      rating: 4.3,
      address: 'Mirpur DOHS, Dhaka',
      location: { lat: 23.8223, lng: 90.3654 }
    },
    worker: {
      id: 'w5',
      name: 'Jahangir Alam',
      phone: '+880 1745-321098',
      verified: false,
      rating: 4.1,
      completedJobs: 34,
      specialization: ['Dog Walking', 'Pet Grooming', 'Pet Feeding']
    },
    serviceCategory: 'pet-care',
    serviceSection: 'Dog Walking',
    serviceName: 'Daily Dog Walking',
    scheduledDate: '2026-01-23',
    scheduledTime: '6:00 PM',
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'nagad',
    transactionId: 'TRX20260121006',
    totalAmount: 500,
    createdAt: '2026-01-21T16:30:00Z',
    updatedAt: '2026-01-22T10:00:00Z',
    adminNotes: 'Customer cancelled due to personal reasons. Refund processed.',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-21T16:30:00Z' },
      { status: 'accepted', timestamp: '2026-01-21T17:00:00Z' },
      { status: 'cancelled', timestamp: '2026-01-22T10:00:00Z', note: 'Cancelled by customer' }
    ]
  },
  {
    id: '7',
    bookingNumber: 'BK-2026-0007',
    user: {
      id: 'u7',
      name: 'Ibrahim Khan',
      phone: '+880 1812-345678',
      email: 'ibrahim@example.com',
      rating: 4.6,
      address: 'Bashundhara R/A, Block E, Dhaka',
      location: { lat: 23.8223, lng: 90.4292 }
    },
    worker: {
      id: 'w6',
      name: 'Rashid Mahmud',
      phone: '+880 1934-567890',
      verified: true,
      rating: 4.5,
      completedJobs: 89,
      specialization: ['Wedding Catering', 'Corporate Events', 'Birthday Parties']
    },
    serviceCategory: 'catering',
    serviceSection: 'Birthday Party',
    serviceName: 'Birthday Party Catering for 50',
    scheduledDate: '2026-01-28',
    scheduledTime: '5:00 PM',
    status: 'accepted',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    transactionId: 'TRX20260122007',
    totalAmount: 12000,
    createdAt: '2026-01-22T09:00:00Z',
    updatedAt: '2026-01-22T10:30:00Z',
    adminNotes: 'High-value booking - ensure quality service',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-22T09:00:00Z' },
      { status: 'accepted', timestamp: '2026-01-22T10:30:00Z' }
    ]
  },
  {
    id: '8',
    bookingNumber: 'BK-2026-0008',
    user: {
      id: 'u8',
      name: 'Rupa Begum',
      phone: '+880 1512-765432',
      email: 'rupa@example.com',
      rating: 4.4,
      address: 'Mohakhali DOHS, Dhaka',
      location: { lat: 23.7806, lng: 90.4053 }
    },
    worker: {
      id: 'w7',
      name: 'Habib Rahman',
      phone: '+880 1823-987654',
      verified: true,
      rating: 4.7,
      completedJobs: 156,
      specialization: ['Window AC', 'Split AC', 'Centralized AC']
    },
    serviceCategory: 'ac-doctor',
    serviceSection: 'AC Maintenance',
    serviceName: 'AC General Service',
    scheduledDate: '2026-01-25',
    scheduledTime: '3:00 PM',
    status: 'accepted',
    paymentStatus: 'paid',
    paymentMethod: 'bkash',
    transactionId: 'TRX20260122008',
    totalAmount: 1000,
    createdAt: '2026-01-22T12:00:00Z',
    updatedAt: '2026-01-22T12:30:00Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-22T12:00:00Z' },
      { status: 'accepted', timestamp: '2026-01-22T12:30:00Z' }
    ]
  },
  {
    id: '9',
    bookingNumber: 'BK-2026-0009',
    user: {
      id: 'u9',
      name: 'Kabir Hossain',
      phone: '+880 1712-654321',
      email: 'kabir@example.com',
      rating: 3.9,
      address: 'Mirpur-10, Dhaka',
      location: { lat: 23.8067, lng: 90.3685 }
    },
    worker: {
      id: 'w8',
      name: 'Nazma Khatun',
      phone: '+880 1945-678901',
      verified: true,
      rating: 4.8,
      completedJobs: 178,
      specialization: ['Kitchen Cleaning', 'Bathroom Cleaning', 'Floor Cleaning']
    },
    serviceCategory: 'cleaning',
    serviceSection: 'Regular Cleaning',
    serviceName: '2 BHK Regular Cleaning',
    scheduledDate: '2026-01-23',
    scheduledTime: '10:00 AM',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    totalAmount: 1500,
    createdAt: '2026-01-20T15:00:00Z',
    updatedAt: '2026-01-23T13:00:00Z',
    adminNotes: 'Customer satisfied with service',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-20T15:00:00Z' },
      { status: 'accepted', timestamp: '2026-01-20T16:00:00Z' },
      { status: 'ongoing', timestamp: '2026-01-23T10:00:00Z' },
      { status: 'completed', timestamp: '2026-01-23T13:00:00Z' }
    ]
  },
  {
    id: '10',
    bookingNumber: 'BK-2026-0010',
    user: {
      id: 'u10',
      name: 'Sabrina Islam',
      phone: '+880 1612-543210',
      email: 'sabrina@example.com',
      rating: 4.5,
      address: 'Baridhara DOHS, Dhaka',
      location: { lat: 23.8103, lng: 90.4125 }
    },
    worker: null,
    serviceCategory: 'electrician',
    serviceSection: 'Lighting Installation',
    serviceName: 'Chandelier Installation',
    scheduledDate: '2026-01-29',
    scheduledTime: '11:00 AM',
    status: 'pending',
    paymentStatus: 'unpaid',
    totalAmount: 2000,
    createdAt: '2026-01-22T13:15:00Z',
    updatedAt: '2026-01-22T13:15:00Z',
    adminNotes: 'Needs experienced electrician for chandelier work',
    statusHistory: [
      { status: 'pending', timestamp: '2026-01-22T13:15:00Z' }
    ]
  }
];

export const calculateBookingStats = (bookings: Booking[]): BookingStats => {
  return {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    ongoing: bookings.filter(b => b.status === 'ongoing').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };
};

export const mockBookingStats: BookingStats = calculateBookingStats(mockBookings);
