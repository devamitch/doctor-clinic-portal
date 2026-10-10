import type {
  Doctor,
  Appointment,
  Specialty,
  TimeSlot,
  Review,
  User,
} from "@/types";

export const mockUser: User = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "/placeholder.svg?height=80&width=80",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1990-05-15",
  gender: "male",
  bloodType: "O+",
  height: 175, // cm
  weight: 70, // kg
  allergies: ["Penicillin", "Pollen"],
  chronicConditions: ["Mild Asthma"],
  emergencyContact: {
    name: "Emma Johnson",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543",
  },
  insuranceProvider: "HealthPlus Insurance",
  insuranceNumber: "HP-123456789",
  address: {
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "USA",
  },
  preferredLanguage: "English",
  notificationPreferences: {
    email: true,
    sms: true,
    push: true,
  },
  memberSince: "2022-03-10",
};

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. James Carlo",
    specialty: "Cardiologist",
    rating: 4.8,
    reviewCount: 127,
    experience: 8,
    avatar: "/placeholder.svg?height=100&width=100",
    isOnline: true,
    isVerified: true,
    consultationFee: 150,
    nextAvailable: "2024-01-15T10:00:00Z",
    hospital: "City General Hospital",
    education: ["MD from Harvard Medical School", "Residency at Mayo Clinic"],
    languages: ["English", "Spanish"],
    about:
      "Dr. James Carlo is a board-certified cardiologist with over 8 years of experience in treating heart conditions.",
    services: [
      "Heart Surgery",
      "ECG",
      "Stress Testing",
      "Cardiac Catheterization",
    ],
  },
  {
    id: "2",
    name: "Dr. Marcus Thomas",
    specialty: "General Physician",
    rating: 4.9,
    reviewCount: 89,
    experience: 12,
    avatar: "/placeholder.svg?height=100&width=100",
    isOnline: false,
    isVerified: true,
    consultationFee: 100,
    nextAvailable: "2024-01-16T14:00:00Z",
    hospital: "Metro Health Center",
    education: ["MD from Johns Hopkins", "Fellowship in Internal Medicine"],
    languages: ["English"],
    about:
      "Experienced general physician specializing in preventive care and chronic disease management.",
    services: [
      "General Checkup",
      "Vaccination",
      "Health Screening",
      "Chronic Care",
    ],
  },
  {
    id: "3",
    name: "Dr. Willie Bator",
    specialty: "Pediatrician",
    rating: 4.7,
    reviewCount: 156,
    experience: 6,
    avatar: "/placeholder.svg?height=100&width=100",
    isOnline: true,
    isVerified: true,
    consultationFee: 120,
    nextAvailable: "2024-01-15T16:00:00Z",
    hospital: "Children's Medical Center",
    education: ["MD from Stanford University", "Pediatric Residency at CHOP"],
    languages: ["English", "French"],
    about:
      "Dedicated pediatrician with expertise in child development and pediatric care.",
    services: [
      "Child Checkup",
      "Vaccination",
      "Growth Monitoring",
      "Developmental Assessment",
    ],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorId: "1",
    doctor: {
      id: "1",
      name: "Dr. James Carlo",
      specialty: "Cardiologist",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    date: "2024-01-15",
    time: "10:00 AM",
    type: "video",
    status: "upcoming",
    symptoms: "Chest pain, shortness of breath",
    location: "City General Hospital",
    notes: "Please bring previous ECG reports",
    duration: 30, // minutes
  },
  {
    id: "2",
    doctorId: "2",
    doctor: {
      id: "2",
      name: "Dr. Marcus Thomas",
      specialty: "General Physician",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    date: "2024-01-16",
    time: "2:00 PM",
    type: "in-person",
    status: "upcoming",
    location: "Metro Health Center",
    duration: 45, // minutes
  },
];

export const mockSpecialties: Specialty[] = [
  { id: "1", name: "Cardiology", icon: "❤️", doctorCount: 24 },
  { id: "2", name: "Dermatology", icon: "🧴", doctorCount: 18 },
  { id: "3", name: "Pediatrics", icon: "👶", doctorCount: 32 },
  { id: "4", name: "Neurology", icon: "🧠", doctorCount: 15 },
  { id: "5", name: "Orthopedics", icon: "🦴", doctorCount: 21 },
  { id: "6", name: "Psychiatry", icon: "🧘", doctorCount: 12 },
];

export const mockTimeSlots: TimeSlot[] = [
  // Morning slots
  { id: "1", time: "09:00 AM", available: true, period: "morning" },
  { id: "2", time: "09:30 AM", available: false, period: "morning" },
  { id: "3", time: "10:00 AM", available: true, period: "morning" },
  { id: "4", time: "10:30 AM", available: true, period: "morning" },
  { id: "5", time: "11:00 AM", available: false, period: "morning" },
  { id: "6", time: "11:30 AM", available: true, period: "morning" },

  // Afternoon slots
  { id: "7", time: "02:00 PM", available: true, period: "afternoon" },
  { id: "8", time: "02:30 PM", available: true, period: "afternoon" },
  { id: "9", time: "03:00 PM", available: false, period: "afternoon" },
  { id: "10", time: "03:30 PM", available: true, period: "afternoon" },
  { id: "11", time: "04:00 PM", available: true, period: "afternoon" },

  // Evening slots
  { id: "12", time: "06:00 PM", available: true, period: "evening" },
  { id: "13", time: "06:30 PM", available: false, period: "evening" },
  { id: "14", time: "07:00 PM", available: true, period: "evening" },
];

export const mockReviews: Review[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    rating: 5,
    comment: "Excellent doctor! Very thorough and caring. Highly recommend.",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: "2",
    patientName: "Mike Chen",
    rating: 4,
    comment:
      "Good experience overall. Doctor was knowledgeable and professional.",
    date: "2024-01-08",
    verified: true,
  },
];
