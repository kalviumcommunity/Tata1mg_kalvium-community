export type ApprovalStatus = 'Pending' | 'Under Review' | 'Verified' | 'Rejected';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  phone: string;
  licenseFile?: string;
  createdAt?: string;
  status: ApprovalStatus;
  regNo?: string;
  hospital?: string;
}

export interface Pharmacist {
  id: string;
  name: string;
  email: string;
  licenseNumber: string;
  phone: string;
  qualifications: string;
  licenseFile?: string;
  createdAt?: string;
  status: ApprovalStatus;
  pharmacyLicense?: string;
  regNo?: string;
  experience?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  licenseNumber: string;
  licenseFile?: string;
  createdAt?: string;
  status: ApprovalStatus;
  drugLicense?: string;
  gst?: string;
  owner?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt?: string;
  title?: string;
  body?: string;
  time?: string;
}

export const doctors: Doctor[] = [
  { id: 'D001', name: 'Dr. Prateek Sharma', email: 'prateek@hospital.com', licenseNumber: 'MCI-2020-DL-45678', phone: '9876543210', specialization: 'Neurology', licenseFile: 'license_prateek.pdf', status: 'Pending', hospital: 'AIIMS Delhi', regNo: 'MCI-2020-DL-45678' },
  { id: 'D002', name: 'Dr. Kavita Menon', email: 'kavita@hospital.com', licenseNumber: 'MCI-2019-KL-12345', phone: '9876543211', specialization: 'Dermatology', licenseFile: 'license_kavita.pdf', status: 'Under Review', hospital: 'Amrita Hospital', regNo: 'MCI-2019-KL-12345' },
  { id: 'D003', name: 'Dr. Sunil Verma', email: 'sunil@hospital.com', licenseNumber: 'MCI-2018-MH-67890', phone: '9876543212', specialization: 'Orthopedics', licenseFile: 'license_sunil.pdf', status: 'Verified', hospital: 'Nanavati Hospital', regNo: 'MCI-2018-MH-67890' },
];

export const pharmacists: Pharmacist[] = [
  { id: 'PH001', name: 'Rahul Mehta', email: 'rahul@pharmacy.com', licenseNumber: 'PCI-GJ-56789', phone: '9876543220', qualifications: 'B.Pharm', licenseFile: 'license_rahul.pdf', status: 'Pending', pharmacyLicense: 'PCI-GJ-2019-34567', regNo: 'PCI-GJ-56789', experience: '6 years' },
  { id: 'PH002', name: 'Sunita Nair', email: 'sunita@pharmacy.com', licenseNumber: 'PCI-KL-67890', phone: '9876543221', qualifications: 'B.Pharm, D.Pharm', licenseFile: 'license_sunita.pdf', status: 'Under Review', pharmacyLicense: 'PCI-KL-2018-45678', regNo: 'PCI-KL-67890', experience: '9 years' },
  { id: 'PH003', name: 'Ajay Patel', email: 'ajay@pharmacy.com', licenseNumber: 'PCI-MH-78901', phone: '9876543222', qualifications: 'B.Pharm', licenseFile: 'license_ajay.pdf', status: 'Verified', pharmacyLicense: 'PCI-MH-2020-56789', regNo: 'PCI-MH-78901', experience: '4 years' },
];

export const pharmacies: Pharmacy[] = [
  { id: 'PHRM001', name: 'Health Plus Pharmacy', email: 'info@healthplus.com', phone: '9876543230', address: '123 Main Street, Mumbai', city: 'Mumbai', licenseNumber: 'DL-2019-MH-34567', status: 'Pending', drugLicense: 'DL-2019-MH-34567', gst: 'GST123456789012', owner: 'Mr. Sharma' },
  { id: 'PHRM002', name: 'Care Pharmacy', email: 'info@carepharmacy.com', phone: '9876543231', address: '456 Oak Avenue, Bangalore', city: 'Bangalore', licenseNumber: 'DL-2018-KA-45678', status: 'Under Review', drugLicense: 'DL-2018-KA-45678', gst: 'GST234567890123', owner: 'Ms. Patel' },
  { id: 'PHRM003', name: 'Wellness Pharmacy', email: 'info@wellnesspharmacy.com', phone: '9876543232', address: '789 Pine Road, Delhi', city: 'Delhi', licenseNumber: 'DL-2017-DL-56789', status: 'Verified', drugLicense: 'DL-2017-DL-56789', gst: 'GST345678901234', owner: 'Mr. Verma' },
];

export const notifications: Notification[] = [
  { id: 'N001', userId: 'admin1', message: 'New doctor registration pending review', type: 'info', read: false, createdAt: new Date().toISOString() },
  { id: 'N002', userId: 'admin1', message: 'Pharmacist verification rejected', type: 'error', read: false, createdAt: new Date().toISOString() },
  { id: 'N003', userId: 'admin1', message: 'Pharmacy approved successfully', type: 'success', read: true, createdAt: new Date().toISOString() },
];

export const metrics = {
  dailyPrescriptions: [
    { day: 'Mon', count: 120 },
    { day: 'Tue', count: 150 },
    { day: 'Wed', count: 130 },
    { day: 'Thu', count: 160 },
    { day: 'Fri', count: 180 },
    { day: 'Sat', count: 140 },
    { day: 'Sun', count: 110 },
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ],
};

export function findDoctor(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}

export function findPharmacist(id: string): Pharmacist | undefined {
  return pharmacists.find((p) => p.id === id);
}

export function findPharmacy(id: string): Pharmacy | undefined {
  return pharmacies.find((ph) => ph.id === id);
}
