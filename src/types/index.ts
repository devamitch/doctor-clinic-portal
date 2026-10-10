export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  bloodType: string;
  height: number; // cm
  weight: number; // kg
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider: string;
  insuranceNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferredLanguage: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  memberSince: string;
};
export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: number;
  avatar: string;
  isOnline: boolean;
  isVerified: boolean;
  consultationFee: number;
  nextAvailable: string;
  hospital: string;
  education: string[];
  languages: string[];
  about: string;
  services: string[];
};

export type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  specialty: string;
  date: string;
  time: string;
  type: "video" | "in-person" | "phone";
  status: "upcoming" | "completed" | "cancelled" | "rescheduled";
  symptoms?: string;
  notes?: string;
};

export type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
  period: "morning" | "afternoon" | "evening";
};

export type Specialty = {
  id: string;
  name: string;
  icon: string;
  doctorCount: number;
};

export type Review = {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  image: string;
};
