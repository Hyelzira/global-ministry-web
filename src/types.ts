// ─── HER ORIGINAL TYPES ───────────────────────────────────────────────────────

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  imageUrl: string;
  videoUrl?: string;
  description: string;
  series: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  category: 'Worship' | 'Community' | 'Outreach' | 'Youth';
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socials?: {
    twitter?: string;
    instagram?: string;
  };
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  contactEmail: string;
}

// ─── API TYPES ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T | null;
  errors: unknown;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export interface NewUserDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  module: string | null;
  roles: string[];
  token: string;
  refreshToken: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  module: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResendConfirmationDto {
  email: string;
}

// ─── USER ─────────────────────────────────────────────────────────────────────

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  profilePictureUrl: string | null;
  module: string | null;
  emailConfirmed: boolean;
  createdOn: string;
  roles: string[];
}

// ─── SERMON ──────────────────────────────────────────────────────────────────

export interface SermonDto {
  id: number;
  title: string;
  speaker: string;
  series: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  sermonDate: string;
  isPublished: boolean;
  createdOn: string;
}

// ─── ANNOUNCEMENT ─────────────────────────────────────────────────────────────

export interface AnnouncementDto {
  id: number;
  title: string;
  content: string;
  module: string;
  category: string;
  isPublished: boolean;
  createdOn: string;
  updatedOn: string | null;
}

// ─── EVENT ────────────────────────────────────────────────────────────────────

export interface EventDto {
  id: number;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl: string | null;
  module: string;
  isCancelled: boolean;
  acceptsRegistrations: boolean;
  acceptsDonations: boolean;
  donationLabel: string | null;
  createdOn: string;
}

// ─── TESTIMONY ────────────────────────────────────────────────────────────────

export interface TestimonyDto {
  id: number;
  name: string;
  content: string;
  attachment: string | null;
  status: string;
  createdAt: string;
}

export interface CreateTestimonyDto {
  name?: string;
  content: string;
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

export interface CreateContactDto {
  fullName: string;
  email: string;
  phoneNumber?: string;
  message: string;
  type: number;
}

export interface ContactDto {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface UpdateContactStatusDto {
  status: number;
}

// ─── PRAYER REQUEST ───────────────────────────────────────────────────────────

export interface CreatePrayerRequestDto {
  name?: string;
  email?: string;
  content: string;
}

export interface PrayerRequestDto {
  id: number;
  name: string;
  content: string;
  anonymousToken: string;
  isAttendedTo: boolean;
  createdAt: string;
}

// ─── DONATION ─────────────────────────────────────────────────────────────────

export interface CreateDonationDto {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  donationType: string;
  eventId?: number;
  eventTitle?: string;
}

export interface DonationResponseDto {
  id: number;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  transactionReference: string;
  paymentMethod: string;
  status: string;
  donationType: string;
  eventId: number | null;
  eventTitle: string | null;
  createdAt: string;
}

export interface DonationGroupDto {
  groupKey: string;
  totalAmount: number;
  count: number;
}

export interface DonationStatsDto {
  grandTotal: number;
  byType: DonationGroupDto[];
  byMethod: DonationGroupDto[];
  byCurrency: DonationGroupDto[];
}

// ─── BOOK ─────────────────────────────────────────────────────────────────────

export interface BookDto {
  id: number;
  title: string;
  author: string;
  description: string | null;
  coverImageUrl: string | null;
  amazonUrl: string | null;
  selarUrl: string | null;
  price: number | null;
  currency: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdOn: string;
  updatedOn: string | null;
}

export interface CreateBookDto {
  title: string;
  author: string;
  description?: string;
  coverImageUrl?: string;
  amazonUrl?: string;
  selarUrl?: string;
  price?: number;
  currency: string;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface UpdateBookDto {
  title: string;
  author: string;
  description?: string;
  coverImageUrl?: string;
  amazonUrl?: string;
  selarUrl?: string;
  price?: number;
  currency: string;
  isFeatured: boolean;
  isPublished: boolean;
}

// ─── TEAM MEMBER ──────────────────────────────────────────────────────────────

export interface TeamMemberDto {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  module: string;
  displayOrder: number;
  isPublished: boolean;
}

// ─── MINISTRY DEPARTMENT ──────────────────────────────────────────────────────

export interface MinistryDepartmentDto {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  contactEmail: string | null;
  displayOrder: number;
  isPublished: boolean;
}

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────

export interface ActivityDto {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  iconName: string | null;
  linkUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export interface DashboardStatsDto {
  // Users
  totalUsers: number;
  totalAdmins: number;
  totalMembers: number;
  totalYouthMembers: number;
  // Announcements
  totalAnnouncements: number;
  publishedAnnouncements: number;
  draftAnnouncements: number;
  ministryAnnouncements: number;
  youthAnnouncements: number;
  // Events
  totalEvents: number;
  upcomingEvents: number;
  cancelledEvents: number;
  ministryEvents: number;
  youthEvents: number;
  // Prayer Requests
  totalPrayerRequests: number;
  pendingPrayerRequests: number;
  attendedPrayerRequests: number;
  // Testimonies
  totalTestimonies: number;
  pendingTestimonies: number;
  approvedTestimonies: number;
  rejectedTestimonies: number;
  // Contacts
  totalContacts: number;
  newContacts: number;
  readContacts: number;
  respondedContacts: number;
  closedContacts: number;
  // Registrations & Sermons
  totalEventRegistrations: number;
  totalSermons: number;
  publishedSermons: number;
  draftSermons: number;
  // Donations
  totalAmountReceived: number;
  completedDonations: number;
  pendingDonations: number;
  // Books
  totalBooks: number;
  publishedBooks: number;
  draftBooks: number;
  featuredBooks: number;
}