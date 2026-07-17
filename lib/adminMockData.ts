export type ApprovalStatus = 'Pending' | 'Under Review' | 'Verified' | 'Rejected';

export interface Doctor {
  id: string;
  name: string;
  regNo: string;
  hospital: string;
  specialization: string;
  licenseFile: string;
  status: ApprovalStatus;
}

export interface Pharmacist {
  id: string;
  name: string;
  pharmacyLicense: string;
  regNo: string;
  experience: string;
  licenseFile: string;
  status: ApprovalStatus;
}

export interface Pharmacy {
  id: string;
  name: string;
  drugLicense: string;
  gst: string;
  address: string;
  owner: string;
  status: ApprovalStatus;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const doctors: Doctor[] = [
  { id: 'D001', name: 'Dr. Prateek Sharma', regNo: 'MCI-2020-DL-45678', hospital: 'AIIMS Delhi', specialization: 'Neurology', licenseFile: 'license_prateek.pdf', status: 'Pending' },
  { id: 'D002', name: 'Dr. Kavita Menon', regNo: 'MCI-2019-KL-12345', hospital: 'Amrita Hospital', specialization: 'Dermatology', licenseFile: 'license_kavita.pdf', status: 'Under Review' },
  { id: 'D003', name: 'Dr. Sunil Verma', regNo: 'MCI-2018-MH-67890', hospital: 'Nanavati Hospital', specialization: 'Orthopedics', licenseFile: 'license_sunil.pdf', status: 'Verified' },
];

export const pharmacists: Pharmacist[] = [
  { id: 'PH001', name: 'Rahul Mehta', pharmacyLicense: 'PCI-GJ-2019-34567', regNo: 'PCI-GJ-56789', experience: '6 years', licenseFile: 'license_rahul.pdf', status: 'Pending' },
  { id: 'PH002', name: 'Sunita Nair', pharmacyLicense: 'PCI-KL-2018-45678', regNo: 'PCI-KL-67890', experience: '9 years', licenseFile: 'license_sunita.pdf', status: 'Under Review' },
  { id: 'PH003', name: 'Ajay Patel', pharmacyLicense: 'PCI-MH-2020-56789', regNo: 'PCI-MH-78901', experience: '4 years', licenseFile: 'license_ajay.pdf', status: 'Verified' },
];

export const pharmacies: Pharmacy[] = [
  { id: 'PH001', name: 'Apollo Pharmacy', drugLicense: 'DL-KA-2019-12345', gst: '29AAACX1234A1Z5', address: 'MG Road, Bangalore', owner: 'Suresh Reddy', status: 'Pending' },
  { id: 'PH002', name: 'MedPlus Stores', drugLicense: 'DL-KA-2018-23456', gst: '29AABCX2345A1Z6', address: 'Koramangala, Bangalore', owner: 'Venkat Rao', status: 'Verified' },
  { id: 'PH003', name: 'LifeCare Pharmacy', drugLicense: 'DL-MH-2020-34567', gst: '27AACCX3456A1Z7', address: 'Andheri, Mumbai', owner: 'Rajesh Shah', status: 'Under Review' },
];

export const notifications: Notification[] = [
  { id: 1, title: 'New Doctor Registration', body: 'Dr. Prateek Sharma submitted documents', time: '10 min ago', read: false },
  { id: 2, title: 'License Expiry Alert', body: 'Apollo Pharmacy license expires in 30 days', time: '1 hour ago', read: false },
  { id: 3, title: 'New Pharmacy Registration', body: 'HealthCare Plus applied for verification', time: '2 hours ago', read: false },
];

export const metrics = {
  dailyPrescriptions: [
    { date: 'Jan 10', count: 245 },
    { date: 'Jan 11', count: 312 },
    { date: 'Jan 12', count: 289 },
    { date: 'Jan 13', count: 358 },
    { date: 'Jan 14', count: 401 },
    { date: 'Jan 15', count: 376 },
    { date: 'Jan 16', count: 428 },
  ],
  monthlyRevenue: [
    { month: 'Aug', revenue: 1450000 },
    { month: 'Sep', revenue: 1620000 },
    { month: 'Oct', revenue: 1580000 },
    { month: 'Nov', revenue: 1780000 },
    { month: 'Dec', revenue: 1920000 },
    { month: 'Jan', revenue: 2150000 },
  ],
};

export function findDoctor(id: string) {
  return doctors.find((item) => item.id === id);
}

export function findPharmacist(id: string) {
  return pharmacists.find((item) => item.id === id);
}

export function findPharmacy(id: string) {
  return pharmacies.find((item) => item.id === id);
}
