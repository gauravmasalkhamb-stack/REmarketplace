"use client";

import React, { useState, useMemo } from 'react';
import {
  Search, ShieldCheck, Star, Award, Building2, MapPin, Briefcase, 
  MessageSquare, CheckCircle2, AlertTriangle, 
  Heart, Filter, ArrowRight, Phone, Mail, Globe, Layers, BarChart3, 
  Plus, Trash2, Send, FileText, Check, X, RefreshCw, Compass, Users, 
  Sparkles, ChevronRight, Scale, Bookmark, IndianRupee, SlidersHorizontal
} from 'lucide-react';

export type UserRole = 'customer' | 'broker' | 'admin';

export interface Broker {
  id: string;
  name: string;
  agency: string;
  title: string;
  location: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  dealsClosed: number;
  experienceYears: number;
  specializations: string[];
  languages: string[];
  bio: string;
  isVerified: boolean;
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'unverified';
  reraNumber: string;
  email: string;
  phone: string;
  commissionRate: string;
  badgeLevel: 'Top Producer' | 'MahaRERA Gold' | 'Premier Consultant';
  activeListingsCount: number;
}

export interface PropertyListing {
  id: string;
  brokerId: string;
  brokerName: string;
  brokerAvatar: string;
  title: string;
  priceRaw: number; // in Lakhs
  priceFormatted: string;
  address: string;
  city: string;
  type: 'Luxury Villa' | 'Penthouse' | 'Sea-Facing Apartment' | 'Grade-A Commercial' | 'Bespoke Plot';
  beds: string;
  baths: number;
  sqft: number;
  image: string;
  featured: boolean;
  status: 'Active' | 'Under Offer' | 'Sold';
  description: string;
  amenities: string[];
}

export interface Review {
  id: string;
  brokerId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  propertyTransacted: string;
  dealType: 'Bought' | 'Sold' | 'Leased';
  date: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'flagged';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  brokerId: string;
  brokerName: string;
  brokerAvatar: string;
  customerId: string;
  customerName: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
  propertyTitle?: string;
  messages: ChatMessage[];
}

export interface VerificationRequest {
  id: string;
  brokerId: string;
  brokerName: string;
  reraNumber: string;
  documentType: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface ReportItem {
  id: string;
  type: 'broker' | 'property' | 'review';
  targetId: string;
  targetTitle: string;
  reporterName: string;
  reason: string;
  date: string;
  status: 'open' | 'resolved' | 'dismissed';
}

const INITIAL_BROKERS: Broker[] = [
  {
    id: 'b1',
    name: 'Rajeshwari Iyer',
    agency: 'Sotheby’s International Realty India',
    title: 'Senior Managing Director - Ultra Luxury Coastal',
    location: 'Worli, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    rating: 4.96,
    reviewCount: 52,
    dealsClosed: 148,
    experienceYears: 14,
    specializations: ['Sea-Facing Penthouses', 'South Mumbai Heritage', 'Ultra-HNI Estates'],
    languages: ['English', 'Hindi', 'Marathi', 'Tamil'],
    bio: 'Pioneering ultra-luxury real estate representation across Worli Sea Face, Malabar Hill, and Bandra West for 14+ years. Handled landmark transactions totaling over ₹950 Cr with absolute discretion.',
    isVerified: true,
    verificationStatus: 'verified',
    reraNumber: 'MAHARERA: A51900028491',
    email: 'rajeshwari.iyer@sothebys-india.com',
    phone: '+91 98201 44810',
    commissionRate: '1.5% - 2.0%',
    badgeLevel: 'MahaRERA Gold',
    activeListingsCount: 4
  },
  {
    id: 'b2',
    name: 'Vikramaditya Singhania',
    agency: 'Singhania Prime Realty Advisors',
    title: 'Principal Partner - Commercial & Penthouse Division',
    location: 'Golf Course Road, Gurugram',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    rating: 4.89,
    reviewCount: 39,
    dealsClosed: 112,
    experienceYears: 11,
    specializations: ['Grade-A Commercial', 'Golf Course Penthouses', 'Diplomatic Enclave Leases'],
    languages: ['English', 'Hindi', 'Punjabi'],
    bio: 'Specialist in NCR luxury residences (DLF Camellias, Magnolias, Aralias) and Grade-A institutional office spaces across DLF CyberCity and Aerocity.',
    isVerified: true,
    verificationStatus: 'verified',
    reraNumber: 'HRERA-PKL-GGM-1420-2021',
    email: 'vikramaditya@singhaniaprime.in',
    phone: '+91 98110 32901',
    commissionRate: '1.0% - 2.0%',
    badgeLevel: 'Top Producer',
    activeListingsCount: 3
  },
  {
    id: 'b3',
    name: 'Ananya Kulkarni',
    agency: 'Bengaluru Tech Corridor Homes',
    title: 'Executive Vice President - Residential Assets',
    location: 'Indiranagar, Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    rating: 4.93,
    reviewCount: 46,
    dealsClosed: 124,
    experienceYears: 10,
    specializations: ['Tech Founders Estates', 'Eco Villas', 'Gated Communities'],
    languages: ['English', 'Kannada', 'Hindi', 'Marathi'],
    bio: 'Trusted advisor to unicorn tech founders, CXOs, and NRI venture partners looking for bespoke luxury estates in Indiranagar, Koramangala, and North Bengaluru Airport Corridor.',
    isVerified: true,
    verificationStatus: 'verified',
    reraNumber: 'PRM/KA/RERA/1251/310/AG/210319',
    email: 'ananya@techcorridorrealty.in',
    phone: '+91 99002 88471',
    commissionRate: '1.5% - 2.0%',
    badgeLevel: 'Top Producer',
    activeListingsCount: 3
  },
  {
    id: 'b4',
    name: 'Rohan Deshmukh',
    agency: 'Deccan Heritage & Commercial Realty',
    title: 'Managing Director - Pune Prime Corridor',
    location: 'Koregaon Park, Pune',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    rating: 4.78,
    reviewCount: 28,
    dealsClosed: 74,
    experienceYears: 8,
    specializations: ['Boutique Villas', 'IT Park Pre-Leases', 'Koregaon Park Bungalows'],
    languages: ['English', 'Marathi', 'Hindi'],
    bio: 'Guiding high-net-worth Pune families and corporate leadership in acquiring heritage bungalows in Koregaon Park, Kalyani Nagar, and prime IT spaces in Baner/Hinjawadi.',
    isVerified: false,
    verificationStatus: 'pending',
    reraNumber: 'MAHARERA: A52100039201',
    email: 'rohan@deccanrealty.in',
    phone: '+91 98500 12093',
    commissionRate: '2.0%',
    badgeLevel: 'Premier Consultant',
    activeListingsCount: 2
  }
];

const INITIAL_PROPERTIES: PropertyListing[] = [
  {
    id: 'p1',
    brokerId: 'b1',
    brokerName: 'Rajeshwari Iyer',
    brokerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    title: 'The Worli Sea Face Sky Villa',
    priceRaw: 2850,
    priceFormatted: '₹28.50 Cr',
    address: '42 Worli Sea Face Promenade',
    city: 'Mumbai',
    type: 'Sea-Facing Apartment',
    beds: '5 BHK Duplex',
    baths: 6,
    sqft: 6800,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    status: 'Active',
    description: 'Ultra-luxurious duplex sky mansion overlooking the Arabian Sea and the Bandra-Worli Sea Link. Private plunge pool on terrace, Italian travertine cladding, 4 dedicated EV car parks, and private biometric elevators.',
    amenities: ['Arabian Sea View', 'Private Plunge Pool', 'Concierge 24/7', 'VRV Air Conditioning', 'Helipad Access']
  },
  {
    id: 'p2',
    brokerId: 'b2',
    brokerName: 'Vikramaditya Singhania',
    brokerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    title: 'Golf Course Sanctuary Penthouse',
    priceRaw: 3400,
    priceFormatted: '₹34.00 Cr',
    address: 'DLF Phase V, Golf Course Road',
    city: 'Delhi NCR (Gurugram)',
    type: 'Penthouse',
    beds: '5 BHK Penthouse',
    baths: 7,
    sqft: 9400,
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    status: 'Active',
    description: 'Palatial penthouse overlooking the championship Arnold Palmer golf greens. Double-height 24ft living salon, heated indoor lap pool, cigar lounge, and bespoke automated Crestron smart home system.',
    amenities: ['Golf Course Panorama', 'Private Heated Pool', 'Clubhouse Privileges', 'Staff Quarters', '7-Tier Security']
  },
  {
    id: 'p3',
    brokerId: 'b3',
    brokerName: 'Ananya Kulkarni',
    brokerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    title: 'Indiranagar Modernist Courtyard Villa',
    priceRaw: 1850,
    priceFormatted: '₹18.50 Cr',
    address: '100ft Road Extension, Defence Colony',
    city: 'Bengaluru',
    type: 'Luxury Villa',
    beds: '4 BHK Luxury Villa',
    baths: 5,
    sqft: 5200,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    status: 'Active',
    description: 'Architect-designed biophilic sanctuary with traditional chettinad pillars blended with brutalist exposed concrete, solar net-metering, internal tropical water courtyard, and temperature-controlled wine cellar.',
    amenities: ['Tropical Courtyard', 'Solar Net Metering', 'Home Theater', 'Rainwater Harvesting', 'Private Garden']
  },
  {
    id: 'p4',
    brokerId: 'b4',
    brokerName: 'Rohan Deshmukh',
    brokerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    title: 'Koregaon Park Green Estate',
    priceRaw: 1250,
    priceFormatted: '₹12.50 Cr',
    address: 'Lane 7, South Main Road',
    city: 'Pune',
    type: 'Luxury Villa',
    beds: '4 BHK Garden Villa',
    baths: 4,
    sqft: 4600,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    featured: false,
    status: 'Active',
    description: 'Set amidst century-old Banyan trees in Pune’s most elite pin code. Zen reflection pond, teakwood wraparound verandas, private gym suite, and servant accommodation.',
    amenities: ['Zen Reflection Pond', 'Teakwood Veranda', 'Private Gym', 'Solar Water Heating', 'CCTV Security']
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    brokerId: 'b1',
    customerId: 'c101',
    customerName: 'Aditya & Priya Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    propertyTransacted: 'Worli Sea Face 4 BHK (₹24.0 Cr)',
    dealType: 'Bought',
    date: '14 August 2026',
    comment: 'Rajeshwari is unquestionably the premier broker in South Mumbai. She secured an off-market deed in Worli before general market release and coordinated title search with Cyril Amarchand Mangaldas seamlessly.',
    isVerifiedPurchase: true,
    status: 'approved'
  },
  {
    id: 'r2',
    brokerId: 'b1',
    customerId: 'c102',
    customerName: 'Gaurav Khandelwal',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    propertyTransacted: 'Bandra West Sea-Facing Apartment (₹14.2 Cr)',
    dealType: 'Sold',
    date: '02 July 2026',
    comment: 'Executed our sale in under 18 days with 100% escrow compliance. Her MahaRERA accreditation and legal precision give ultimate peace of mind.',
    isVerifiedPurchase: true,
    status: 'approved'
  },
  {
    id: 'r3',
    brokerId: 'b2',
    customerId: 'c103',
    customerName: 'Samir & Radhika Bansal',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    propertyTransacted: 'DLF Camellias Duplex (₹31.5 Cr)',
    dealType: 'Bought',
    date: '18 June 2026',
    comment: 'Vikramaditya understands HNI privacy better than anyone in Delhi NCR. Clear paperwork, zero hidden costs, and excellent negotiation with DLF builders.',
    isVerifiedPurchase: true,
    status: 'approved'
  },
  {
    id: 'r4',
    brokerId: 'b3',
    customerId: 'c104',
    customerName: 'Karthik Narayanan',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    propertyTransacted: 'Indiranagar 100ft Plot & Villa (₹16.8 Cr)',
    dealType: 'Bought',
    date: '30 May 2026',
    comment: 'Ananya matched our exact requirement without wasting any time on unqualified tours. Her knowledge of BBMP and BDA title clearance is unmatched in Bengaluru.',
    isVerifiedPurchase: true,
    status: 'approved'
  }
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    brokerId: 'b1',
    brokerName: 'Rajeshwari Iyer',
    brokerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    customerId: 'c1',
    customerName: 'Aarav Mehta',
    lastMessage: 'I have scheduled your private preview of the Worli Sky Villa for Friday 4 PM.',
    updatedAt: '10 mins ago',
    unreadCount: 1,
    propertyTitle: 'The Worli Sea Face Sky Villa (₹28.50 Cr)',
    messages: [
      {
        id: 'm1',
        senderId: 'c1',
        senderName: 'Aarav Mehta',
        senderRole: 'customer',
        text: 'Namaste Rajeshwari, I am interested in viewing the Worli Sea Face Sky Villa. Can we inspect the deed documents and parking bays?',
        timestamp: '11:15 AM'
      },
      {
        id: 'm2',
        senderId: 'b1',
        senderName: 'Rajeshwari Iyer',
        senderRole: 'broker',
        text: 'Good morning Aarav. Absolutely. The title report has been vetted by MahaRERA legal advisors, and all 4 EV parking slots are deed-allocated.',
        timestamp: '11:22 AM'
      },
      {
        id: 'm3',
        senderId: 'b1',
        senderName: 'Rajeshwari Iyer',
        senderRole: 'broker',
        text: 'I have scheduled your private preview of the Worli Sky Villa for Friday 4 PM.',
        timestamp: '11:25 AM'
      }
    ]
  }
];

const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'vr1',
    brokerId: 'b4',
    brokerName: 'Rohan Deshmukh',
    reraNumber: 'MAHARERA: A52100039201',
    documentType: 'MahaRERA Real Estate Agent License Certificate',
    submittedDate: '18 Sep 2026',
    status: 'pending',
    notes: 'Awaiting digital certificate validation via Maharashtra Real Estate Regulatory Authority portal.'
  }
];

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep1',
    type: 'property',
    targetId: 'p4',
    targetTitle: 'Koregaon Park Green Estate',
    reporterName: 'Sunil_K_Pune',
    reason: 'Please verify if carpet area reflects MahaRERA standard definition vs built-up.',
    date: '19 Sep 2026',
    status: 'open'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'search' | 'compare' | 'properties' | 'customerPortal' | 'brokerPortal' | 'adminPortal'>('home');
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showArchModal, setShowArchModal] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeChatConvId, setActiveChatConvId] = useState<string>('conv-1');

  // Role Simulation
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [currentUserId] = useState<string>('c1');
  const [currentUserName] = useState<string>('Aarav Mehta');

  // App Data State
  const [brokers, setBrokers] = useState<Broker[]>(INITIAL_BROKERS);
  const [properties, setProperties] = useState<PropertyListing[]>(INITIAL_PROPERTIES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(INITIAL_VERIFICATION_REQUESTS);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);

  // Favorites & Compare Deck
  const [savedBrokerIds, setSavedBrokerIds] = useState<string[]>(['b1']);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['p1', 'p2']);
  const [compareBrokerIds, setCompareBrokerIds] = useState<string[]>(['b1', 'b2']);

  // Filters (Indian Cities & Specs)
  const [searchCity, setSearchCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(4.5);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Property Filters (INR)
  const [propTypeFilter, setPropTypeFilter] = useState<string>('All');
  const [propMaxPrice, setPropMaxPrice] = useState<number>(5000); // in Lakhs (50 Cr)

  // Modals
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [newReviewBrokerId, setNewReviewBrokerId] = useState<string>('b1');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewProperty, setNewReviewProperty] = useState<string>('');
  const [newReviewDealType, setNewReviewDealType] = useState<'Bought' | 'Sold' | 'Leased'>('Bought');

  const [newPropertyModalOpen, setNewPropertyModalOpen] = useState<boolean>(false);
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropPriceRaw, setNewPropPriceRaw] = useState(1500); // in Lakhs
  const [newPropAddress, setNewPropAddress] = useState('');
  const [newPropCity, setNewPropCity] = useState('Mumbai');
  const [newPropType, setNewPropType] = useState<'Luxury Villa' | 'Penthouse' | 'Sea-Facing Apartment' | 'Grade-A Commercial' | 'Bespoke Plot'>('Sea-Facing Apartment');
  const [newPropBeds, setNewPropBeds] = useState('4 BHK');
  const [newPropBaths, setNewPropBaths] = useState(4);
  const [newPropSqft, setNewPropSqft] = useState(4200);
  const [newPropDesc, setNewPropDesc] = useState('');
  const [newPropImage, setNewPropImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredBrokers = useMemo(() => {
    return brokers.filter((b) => {
      const matchCity = searchCity === 'All' || b.location.toLowerCase().includes(searchCity.toLowerCase());
      const matchQuery = searchQuery === '' || 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.reraNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchSpec = selectedSpecialization === 'All' || b.specializations.includes(selectedSpecialization);
      const matchRating = b.rating >= minRating;
      const matchExp = b.experienceYears >= minExperience;
      const matchLang = selectedLanguage === 'All' || b.languages.includes(selectedLanguage);
      const matchVerified = !onlyVerified || b.isVerified;

      return matchCity && matchQuery && matchSpec && matchRating && matchExp && matchLang && matchVerified;
    });
  }, [brokers, searchCity, searchQuery, selectedSpecialization, minRating, minExperience, selectedLanguage, onlyVerified]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchType = propTypeFilter === 'All' || p.type === propTypeFilter;
      const matchPrice = p.priceRaw <= propMaxPrice;
      return matchType && matchPrice;
    });
  }, [properties, propTypeFilter, propMaxPrice]);

  const toggleFavoriteBroker = (id: string) => {
    setSavedBrokerIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast(savedBrokerIds.includes(id) ? 'Broker removed from saved list' : 'Broker saved to your vault');
  };

  const toggleFavoriteProperty = (id: string) => {
    setSavedPropertyIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast(savedPropertyIds.includes(id) ? 'Property removed from wishlist' : 'Property saved to wishlist');
  };

  const toggleCompareBroker = (id: string) => {
    if (compareBrokerIds.includes(id)) {
      setCompareBrokerIds((prev) => prev.filter((bId) => bId !== id));
      showToast('Removed from comparison');
    } else {
      if (compareBrokerIds.length >= 3) {
        showToast('Max 3 brokers can be compared concurrently.');
        return;
      }
      setCompareBrokerIds((prev) => [...prev, id]);
      showToast('Added to comparison deck');
    }
  };

  const handleStartChatWithBroker = (broker: Broker, initialContext?: string) => {
    const existing = conversations.find((c) => c.brokerId === broker.id);
    if (existing) {
      setActiveChatConvId(existing.id);
      setIsChatOpen(true);
    } else {
      const newConvId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: newConvId,
        brokerId: broker.id,
        brokerName: broker.name,
        brokerAvatar: broker.avatar,
        customerId: currentUserId,
        customerName: currentUserName,
        lastMessage: initialContext || `Namaste ${broker.name}, I would like to consult with you regarding property acquisitions.`,
        updatedAt: 'Just now',
        unreadCount: 0,
        propertyTitle: initialContext ? 'Direct Listing Inquiry' : undefined,
        messages: [
          {
            id: `m-${Date.now()}`,
            senderId: currentUserId,
            senderName: currentUserName,
            senderRole: 'customer',
            text: initialContext || `Namaste ${broker.name}, I would like to schedule a private discussion.`,
            timestamp: 'Just now'
          }
        ]
      };
      setConversations([newConv, ...conversations]);
      setActiveChatConvId(newConvId);
      setIsChatOpen(true);
    }
    showToast(`RERA-Encrypted channel opened with ${broker.name}`);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChatConvId) {
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: activeRole === 'broker' ? c.brokerId : currentUserId,
            senderName: activeRole === 'broker' ? c.brokerName : currentUserName,
            senderRole: activeRole,
            text: text.trim(),
            timestamp: 'Just now'
          };
          return {
            ...c,
            lastMessage: text.trim(),
            updatedAt: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const reviewObj: Review = {
      id: `rev-${Date.now()}`,
      brokerId: newReviewBrokerId,
      customerId: currentUserId,
      customerName: currentUserName,
      customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      rating: newReviewRating,
      propertyTransacted: newReviewProperty || 'Luxury Residential Advisory',
      dealType: newReviewDealType,
      date: '20 September 2026',
      comment: newReviewComment,
      isVerifiedPurchase: true,
      status: 'approved'
    };

    setReviews([reviewObj, ...reviews]);
    setBrokers((prev) =>
      prev.map((b) => {
        if (b.id === newReviewBrokerId) {
          const brokerRevs = [reviewObj, ...reviews.filter((r) => r.brokerId === b.id)];
          const avg = brokerRevs.reduce((acc, curr) => acc + curr.rating, 0) / brokerRevs.length;
          return {
            ...b,
            rating: parseFloat(avg.toFixed(2)),
            reviewCount: brokerRevs.length
          };
        }
        return b;
      })
    );

    setReviewModalOpen(false);
    setNewReviewComment('');
    setNewReviewProperty('');
    showToast('MahaRERA/Registry verified review published');
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle || !newPropAddress) return;

    const broker = brokers[0];
    const formattedPrice = newPropPriceRaw >= 100 
      ? `₹${(newPropPriceRaw / 100).toFixed(2)} Cr`
      : `₹${newPropPriceRaw} Lakhs`;

    const newProp: PropertyListing = {
      id: `p-${Date.now()}`,
      brokerId: broker.id,
      brokerName: broker.name,
      brokerAvatar: broker.avatar,
      title: newPropTitle,
      priceRaw: Number(newPropPriceRaw),
      priceFormatted: formattedPrice,
      address: newPropAddress,
      city: newPropCity,
      type: newPropType,
      beds: newPropBeds,
      baths: Number(newPropBaths),
      sqft: Number(newPropSqft),
      image: newPropImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      featured: false,
      status: 'Active',
      description: newPropDesc || 'Exclusive premium residence represented under RERA mandate.',
      amenities: ['24/7 Security', 'Covered Car Parks', 'Clubhouse Access', 'Power Backup']
    };

    setProperties([newProp, ...properties]);
    setBrokers((prev) =>
      prev.map((b) => (b.id === broker.id ? { ...b, activeListingsCount: b.activeListingsCount + 1 } : b))
    );
    setNewPropertyModalOpen(false);
    showToast('Listing published to BrokerVault India index');
  };

  const handleAdminVerifyBroker = (requestId: string, brokerId: string, approve: boolean) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: approve ? 'approved' : 'rejected' } : r))
    );
    setBrokers((prev) =>
      prev.map((b) => (b.id === brokerId ? { ...b, isVerified: approve, verificationStatus: approve ? 'verified' : 'rejected' } : b))
    );
    showToast(approve ? 'RERA License verified. Badge granted.' : 'Verification rejected.');
  };

  const handleModerateReview = (reviewId: string, action: 'approve' | 'flag') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: action === 'approve' ? 'approved' : 'flagged' } : r))
    );
    showToast(action === 'approve' ? 'Review approved for public feed' : 'Review flagged and hidden');
  };

  const activeConversation = conversations.find((c) => c.id === activeChatConvId) || conversations[0];

  return (
    <div className="min-h-screen bg-black text-[#EDEDED] font-sans antialiased selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#222222] bg-black/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Vercel-Style Monogram Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => { setCurrentTab('home'); setSelectedBrokerId(null); setSelectedPropertyId(null); }}
            >
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black tracking-tighter text-sm transition-transform group-hover:scale-105">
                ▲
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-white">
                  BrokerVault<span className="text-[#888888]">.in</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#181818] text-[#888888] border border-[#2B2B2B] px-1.5 py-0.2 rounded">
                  RERA Verified
                </span>
              </div>
            </div>

            {/* Geist Minimal Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'home', label: 'Overview' },
                { id: 'search', label: 'Brokers' },
                { id: 'compare', label: `Compare (${compareBrokerIds.length})` },
                { id: 'properties', label: 'Prime Listings' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id as any);
                    setSelectedBrokerId(null);
                    setSelectedPropertyId(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    currentTab === item.id 
                      ? 'text-white bg-[#1A1A1A] border border-[#333333]' 
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Tools & Role Toggle */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowArchModal(true)}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#262626] bg-[#0E0E0E] text-[11px] font-mono text-[#A1A1A1] hover:text-white hover:border-[#444444] transition-colors"
                title="System Specs & RERA APIs"
              >
                <Layers className="h-3 w-3 text-white" />
                <span>Architecture</span>
              </button>

              {/* Minimal Role Tabs */}
              <div className="flex items-center bg-[#111111] border border-[#262626] rounded-md p-0.5 text-xs">
                {(['customer', 'broker', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setActiveRole(role);
                      if (role === 'customer') setCurrentTab('customerPortal');
                      if (role === 'broker') setCurrentTab('brokerPortal');
                      if (role === 'admin') setCurrentTab('adminPortal');
                    }}
                    className={`px-2.5 py-1 rounded capitalize text-[11px] font-medium transition-all ${
                      activeRole === role
                        ? 'bg-white text-black font-semibold'
                        : 'text-[#888888] hover:text-[#CCCCCC]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Chat Drawer Button */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="relative p-2 rounded-md bg-[#111111] border border-[#262626] text-[#A1A1A1] hover:text-white hover:border-[#3E3E3E] transition"
                aria-label="Direct Consultations"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  1
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content View Switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedBrokerId ? (
          <BrokerDetailView
            broker={brokers.find((b) => b.id === selectedBrokerId)!}
            allProperties={properties.filter((p) => p.brokerId === selectedBrokerId)}
            allReviews={reviews.filter((r) => r.brokerId === selectedBrokerId && r.status === 'approved')}
            onBack={() => setSelectedBrokerId(null)}
            onContact={(b) => handleStartChatWithBroker(b)}
            onCompare={(b) => toggleCompareBroker(b.id)}
            isCompared={compareBrokerIds.includes(selectedBrokerId)}
            onFavorite={(b) => toggleFavoriteBroker(b.id)}
            isFavorited={savedBrokerIds.includes(selectedBrokerId)}
            onOpenReviewModal={(bId) => {
              setNewReviewBrokerId(bId);
              setReviewModalOpen(true);
            }}
            onSelectProperty={(pId) => setSelectedPropertyId(pId)}
          />
        ) : selectedPropertyId ? (
          <PropertyDetailView
            property={properties.find((p) => p.id === selectedPropertyId)!}
            broker={brokers.find((b) => b.id === properties.find((p) => p.id === selectedPropertyId)?.brokerId)!}
            onBack={() => setSelectedPropertyId(null)}
            onContactBroker={(broker, context) => handleStartChatWithBroker(broker, context)}
            onFavorite={(pId) => toggleFavoriteProperty(pId)}
            isFavorited={savedPropertyIds.includes(selectedPropertyId)}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <LandingPageView
                brokers={brokers}
                properties={properties}
                onExploreBrokers={() => setCurrentTab('search')}
                onSelectBroker={(id) => setSelectedBrokerId(id)}
                onSelectProperty={(id) => setSelectedPropertyId(id)}
                onCompare={(id) => toggleCompareBroker(id)}
                comparedIds={compareBrokerIds}
                onSearchCity={(city) => {
                  setSearchCity(city);
                  setCurrentTab('search');
                }}
              />
            )}

            {currentTab === 'search' && (
              <BrokerDiscoveryView
                brokers={filteredBrokers}
                searchCity={searchCity}
                setSearchCity={setSearchCity}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedSpecialization={selectedSpecialization}
                setSelectedSpecialization={setSelectedSpecialization}
                minRating={minRating}
                setMinRating={setMinRating}
                minExperience={minExperience}
                setMinExperience={setMinExperience}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                onlyVerified={onlyVerified}
                setOnlyVerified={setOnlyVerified}
                onSelectBroker={(id) => setSelectedBrokerId(id)}
                onContactBroker={(b) => handleStartChatWithBroker(b)}
                onCompare={(id) => toggleCompareBroker(id)}
                comparedIds={compareBrokerIds}
                onToggleFavorite={(id) => toggleFavoriteBroker(id)}
                favoriteIds={savedBrokerIds}
              />
            )}

            {currentTab === 'compare' && (
              <BrokerCompareView
                brokerIds={compareBrokerIds}
                allBrokers={brokers}
                onRemove={(id) => toggleCompareBroker(id)}
                onSelectBroker={(id) => setSelectedBrokerId(id)}
                onContactBroker={(b) => handleStartChatWithBroker(b)}
                onAddMore={() => setCurrentTab('search')}
              />
            )}

            {currentTab === 'properties' && (
              <PropertyMarketplaceView
                properties={filteredProperties}
                propTypeFilter={propTypeFilter}
                setPropTypeFilter={setPropTypeFilter}
                propMaxPrice={propMaxPrice}
                setPropMaxPrice={setPropMaxPrice}
                onSelectProperty={(id) => setSelectedPropertyId(id)}
                onContactBroker={(b, title) => handleStartChatWithBroker(b, `Inquiry regarding listing: ${title}`)}
                onToggleFavorite={(id) => toggleFavoriteProperty(id)}
                favoriteIds={savedPropertyIds}
              />
            )}

            {currentTab === 'customerPortal' && (
              <CustomerPortalView
                savedBrokers={brokers.filter((b) => savedBrokerIds.includes(b.id))}
                savedProperties={properties.filter((p) => savedPropertyIds.includes(p.id))}
                conversations={conversations}
                onSelectBroker={(id) => setSelectedBrokerId(id)}
                onSelectProperty={(id) => setSelectedPropertyId(id)}
                onOpenChat={(convId) => {
                  setActiveChatConvId(convId);
                  setIsChatOpen(true);
                }}
                onRemoveFavoriteBroker={(id) => toggleFavoriteBroker(id)}
                onRemoveFavoriteProperty={(id) => toggleFavoriteProperty(id)}
              />
            )}

            {currentTab === 'brokerPortal' && (
              <BrokerPortalView
                broker={brokers[0]}
                properties={properties.filter((p) => p.brokerId === brokers[0].id)}
                leads={conversations.filter((c) => c.brokerId === brokers[0].id)}
                reviews={reviews.filter((r) => r.brokerId === brokers[0].id)}
                onOpenNewPropertyModal={() => setNewPropertyModalOpen(true)}
                onOpenChat={(convId) => {
                  setActiveChatConvId(convId);
                  setIsChatOpen(true);
                }}
                onRequestVerification={() => {
                  showToast('MahaRERA audit request sent to platform registrar.');
                }}
              />
            )}

            {currentTab === 'adminPortal' && (
              <AdminDashboardView
                brokers={brokers}
                properties={properties}
                reviews={reviews}
                verificationRequests={verificationRequests}
                reports={reports}
                onVerifyBroker={handleAdminVerifyBroker}
                onModerateReview={handleModerateReview}
                onDismissReport={(rId) => {
                  setReports((prev) => prev.filter((r) => r.id !== rId));
                  showToast('Complaint resolved & closed.');
                }}
              />
            )}
          </>
        )}
      </main>

      {}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0A0A0A] border-l border-[#222222] shadow-2xl flex flex-col">
          <div className="p-4 border-b border-[#222222] flex items-center justify-between bg-black">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation?.brokerAvatar}
                alt={activeConversation?.brokerName}
                className="w-9 h-9 rounded-full object-cover border border-[#333333]"
              />
              <div>
                <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  {activeRole === 'broker' ? activeConversation?.customerName : activeConversation?.brokerName}
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </h4>
                <p className="text-[11px] font-mono text-[#888888] truncate max-w-[220px]">
                  {activeConversation?.propertyTitle || 'RERA Certified Channel'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded text-[#888888] hover:text-white hover:bg-[#1A1A1A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-3 py-2 bg-[#111111] border-b border-[#222222] flex gap-1.5 overflow-x-auto text-xs">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChatConvId(c.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition ${
                  c.id === activeChatConvId
                    ? 'bg-white text-black font-semibold'
                    : 'bg-[#181818] text-[#888888] hover:text-white border border-[#282828]'
                }`}
              >
                {activeRole === 'broker' ? c.customerName : c.brokerName.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black">
            {activeConversation?.messages.map((m) => {
              const isCurrentUser =
                (activeRole === 'customer' && m.senderRole === 'customer') ||
                (activeRole === 'broker' && m.senderRole === 'broker');

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] font-mono text-[#666666] mb-1">
                    {m.senderName} • {m.timestamp}
                  </span>
                  <div
                    className={`max-w-[85%] px-3.5 py-2 rounded-lg text-xs leading-relaxed ${
                      isCurrentUser
                        ? 'bg-white text-black font-normal'
                        : 'bg-[#141414] text-[#E1E1E1] border border-[#262626]'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#222222] bg-[#0A0A0A]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('chatInput') as HTMLInputElement;
                handleSendMessage(input.value);
                input.value = '';
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                name="chatInput"
                placeholder={`Message as ${activeRole === 'broker' ? 'Broker' : 'Client'}...`}
                className="flex-1 bg-[#121212] border border-[#2B2B2B] rounded-md px-3 py-2 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#666666]"
              />
              <button
                type="submit"
                className="p-2 rounded-md bg-white text-black hover:bg-[#E5E5E5] transition flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#282828] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#222222] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                Submit RERA / Registry-Verified Client Review
              </h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-[#777777] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#888888] mb-1 font-mono text-[11px]">BROKER</label>
                <select
                  value={newReviewBrokerId}
                  onChange={(e) => setNewReviewBrokerId(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2.5 text-white"
                >
                  {brokers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.agency} ({b.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#888888] mb-1 font-mono text-[11px]">RATING</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 text-white hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= newReviewRating ? 'fill-white text-white' : 'text-[#333333]'}`}
                      />
                    </button>
                  ))}
                  <span className="font-mono text-white font-bold ml-2">{newReviewRating}.0 / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888888] mb-1 font-mono text-[11px]">TRANSACTION TYPE</label>
                  <select
                    value={newReviewDealType}
                    onChange={(e) => setNewReviewDealType(e.target.value as any)}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                  >
                    <option value="Bought">Buyer Representation</option>
                    <option value="Sold">Seller Representation</option>
                    <option value="Leased">Commercial Lease Representation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#888888] mb-1 font-mono text-[11px]">ASSET / VALUE</label>
                  <input
                    type="text"
                    placeholder="e.g. Worli Penthouse (₹22 Cr)"
                    value={newReviewProperty}
                    onChange={(e) => setNewReviewProperty(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#888888] mb-1 font-mono text-[11px]">TRANSPARENT CLIENT FEEDBACK</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail negotiation skills, title clarity, registration speed, and advisory quality..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2.5 text-white placeholder-[#444444] focus:border-[#777777] outline-none"
                />
              </div>

              <div className="p-3 bg-[#111111] border border-[#222222] rounded-md text-[11px] text-[#888888] font-mono leading-relaxed">
                Notice: All reviews are reconciled against public state sub-registrar deed indices and MahaRERA/HRERA/KRERA registry logs.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md border border-[#333333] text-[#AAAAAA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-white text-black font-semibold hover:bg-[#E5E5E5] transition"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {newPropertyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#282828] rounded-xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-[#222222] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-white" />
                List Prime Indian Real Estate Asset
              </h3>
              <button onClick={() => setNewPropertyModalOpen(false)} className="text-[#777777] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#888888] mb-1 font-mono text-[11px]">PROPERTY TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sea-Facing Sky Duplex at Worli"
                  value={newPropTitle}
                  onChange={(e) => setNewPropTitle(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2.5 text-white focus:border-[#777777] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888888] mb-1 font-mono text-[11px]">PRICE (IN LAKHS)</label>
                  <input
                    type="number"
                    required
                    value={newPropPriceRaw}
                    onChange={(e) => setNewPropPriceRaw(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                  />
                  <span className="text-[10px] font-mono text-[#777777] mt-0.5 block">
                    {newPropPriceRaw >= 100 ? `≈ ₹${(newPropPriceRaw / 100).toFixed(2)} Cr` : `₹${newPropPriceRaw} Lakhs`}
                  </span>
                </div>
                <div>
                  <label className="block text-[#888888] mb-1 font-mono text-[11px]">CATEGORY</label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as any)}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                  >
                    <option value="Sea-Facing Apartment">Sea-Facing Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Luxury Villa">Luxury Villa</option>
                    <option value="Grade-A Commercial">Grade-A Commercial</option>
                    <option value="Bespoke Plot">Bespoke Plot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888888] mb-1 font-mono text-[11px]">CITY / METRO</label>
                  <select
                    value={newPropCity}
                    onChange={(e) => setNewPropCity(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR (Gurugram)">Delhi NCR (Gurugram)</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#888888] mb-1 font-mono text-[11px]">CONFIGURATION</label>
                  <input
                    type="text"
                    value={newPropBeds}
                    onChange={(e) => setNewPropBeds(e.target.value)}
                    placeholder="e.g. 4 BHK Duplex"
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#888888] mb-1 font-mono text-[11px]">ADDRESS / LOCALITY</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18 Worli Sea Face Promenade"
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888888] mb-1 font-mono text-[11px]">BATHROOMS</label>
                  <input
                    type="number"
                    value={newPropBaths}
                    onChange={(e) => setNewPropBaths(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#888888] mb-1 font-mono text-[11px]">CARPET AREA (SQ FT)</label>
                  <input
                    type="number"
                    value={newPropSqft}
                    onChange={(e) => setNewPropSqft(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#888888] mb-1 font-mono text-[11px]">HERO IMAGE URL</label>
                <input
                  type="text"
                  value={newPropImage}
                  onChange={(e) => setNewPropImage(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#888888] mb-1 font-mono text-[11px]">ARCHITECTURAL HIGHLIGHTS</label>
                <textarea
                  rows={3}
                  value={newPropDesc}
                  onChange={(e) => setNewPropDesc(e.target.value)}
                  placeholder="Describe sea views, materials, structural architect, Vaastu compliance, and access..."
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-2 text-white outline-none focus:border-[#777777]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewPropertyModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md border border-[#333333] text-[#AAAAAA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-white text-black font-semibold hover:bg-[#E5E5E5] transition"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#282828] rounded-xl max-w-4xl w-full p-6 shadow-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#222222] pb-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-white" />
                  architecture_spec.indian_real_estate.ts
                </h3>
                <p className="text-xs text-[#888888] mt-0.5">Commercial marketplace engine with MahaRERA/KRERA validation layer</p>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="p-1 rounded text-[#888888] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#CCCCCC] font-sans">
              <div className="bg-[#000000] p-4 rounded-lg border border-[#222222]">
                <span className="font-mono text-white text-xs block mb-1">1. Full-Stack System Design</span>
                <p className="text-[#888888] text-[11px] leading-relaxed mb-3">
                  Next.js App Router (SSR + Edge Caching) • PostgreSQL with Prisma ORM • Redis for Broker Search Index • Socket.io for Real-Time Consultations • MahaRERA Verification Gateway.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 bg-[#0F0F0F] border border-[#222222] rounded">
                    <span className="text-white block font-bold mb-0.5">Frontend Tier</span>
                    React 18, Tailwind CSS, Vercel Geist Tokens, Monospace tags, responsive drawer.
                  </div>
                  <div className="p-2.5 bg-[#0F0F0F] border border-[#222222] rounded">
                    <span className="text-white block font-bold mb-0.5">RERA Verification</span>
                    API bridge to state portals (MahaRERA, KRERA, HRERA) cross-checking agent license status.
                  </div>
                  <div className="p-2.5 bg-[#0F0F0F] border border-[#222222] rounded">
                    <span className="text-white block font-bold mb-0.5">Deed Title Matching</span>
                    Ensures reviews are attached only to authentic recorded transactions or verified tokens.
                  </div>
                </div>
              </div>

              <div className="bg-[#000000] p-4 rounded-lg border border-[#222222]">
                <span className="font-mono text-white text-xs block mb-2">2. Database Schema (Prisma / SQL)</span>
                <pre className="p-3 bg-[#0F0F0F] rounded border border-[#1F1F1F] font-mono text-[10.5px] text-[#A0A0A0] overflow-x-auto">
{`model Broker {
  id               String      @id @default(uuid())
  name             String
  agency           String
  location         String      // e.g. "Worli, Mumbai"
  reraNumber       String      @unique // Indexed: "MAHARERA: A51900028491"
  isVerified       Boolean     @default(false)
  rating           Decimal     @default(5.00)
  reviewCount      Int         @default(0)
  dealsClosed      Int         @default(0)
  commissionRate   String      // "1.5% - 2.0%"
  properties       Property[]
  reviews          Review[]
}

model Property {
  id               String      @id @default(uuid())
  brokerId         String
  broker           Broker      @relation(fields: [brokerId], references: [id])
  title            String
  priceRawLakhs    Int         // stored in Lakhs INR (e.g. 2850 for ₹28.50 Cr)
  city             String      // "Mumbai" | "Bengaluru" | "Pune" | "Delhi NCR"
  beds             String      // "4 BHK Duplex"
  sqftCarpet       Int
}`}
                </pre>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-4 py-1.5 bg-white text-black font-semibold text-xs rounded-md hover:bg-[#E5E5E5]"
              >
                Close Spec
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#141414] border border-[#333333] text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Vercel Footer */}
      <footer className="mt-20 border-t border-[#1F1F1F] bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-white font-semibold">▲ BrokerVault India</span>
            <span>— The Trust Layer for Indian Real Estate Advisory.</span>
          </div>
          <div className="flex items-center gap-4 text-[#888888] font-mono text-[11px]">
            <button onClick={() => setShowArchModal(true)} className="hover:text-white">Architecture</button>
            <button onClick={() => setCurrentTab('search')} className="hover:text-white">Brokers</button>
            <button onClick={() => setCurrentTab('properties')} className="hover:text-white">Listings</button>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingPageView({
  brokers,
  properties,
  onExploreBrokers,
  onSelectBroker,
  onSelectProperty,
  onCompare,
  comparedIds,
  onSearchCity
}: {
  brokers: Broker[];
  properties: PropertyListing[];
  onExploreBrokers: () => void;
  onSelectBroker: (id: string) => void;
  onSelectProperty: (id: string) => void;
  onCompare: (id: string) => void;
  comparedIds: string[];
  onSearchCity: (city: string) => void;
}) {
  const [cityInput, setCityInput] = useState('');

  return (
    <div className="space-y-16">
      {/* Vercel-Style Minimal Hero */}
      <section className="text-center pt-8 pb-12 border-b border-[#1F1F1F]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#2A2A2A] text-white text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          State RERA Accredited Marketplace
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Partner with India’s Top 1% <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CCCCCC] to-[#777777]">
            RERA-Certified Real Estate Brokers.
          </span>
        </h1>

        <p className="mt-4 text-xs sm:text-sm text-[#888888] max-w-2xl mx-auto leading-relaxed font-sans">
          Zero unvetted agents. Zero duplicate listings. Direct access to verified track records across Mumbai, Gurugram, Bengaluru, and Pune.
        </p>

        {/* Hero Search Box */}
        <div className="mt-8 max-w-xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchCity(cityInput);
            }}
            className="flex items-center bg-[#0F0F0F] border border-[#2B2B2B] rounded-lg p-1.5 focus-within:border-white transition"
          >
            <div className="pl-3 pr-2 text-[#777777]">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <input
              type="text"
              placeholder="Search by city (Mumbai, Bengaluru, Gurugram, Pune)..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder-[#555555] outline-none px-2"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition"
            >
              Explore Brokers
            </button>
          </form>

          {/* Quick Hub Pills */}
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-[11px] font-mono text-[#777777]">
            <span>Metros:</span>
            {['Mumbai', 'Bengaluru', 'Delhi NCR (Gurugram)', 'Pune'].map((loc) => (
              <button
                key={loc}
                onClick={() => onSearchCity(loc)}
                className="px-2 py-0.5 rounded bg-[#111111] hover:bg-[#1C1C1C] text-[#BBBBBB] border border-[#262626]"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* High-Contrast Technical Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#222222]">
            <span className="text-xl font-mono font-bold text-white block">₹1,850 Cr+</span>
            <span className="text-[11px] font-mono text-[#777777]">Verified Sales Volume</span>
          </div>
          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#222222]">
            <span className="text-xl font-mono font-bold text-white block">100%</span>
            <span className="text-[11px] font-mono text-[#777777]">RERA License Matched</span>
          </div>
          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#222222]">
            <span className="text-xl font-mono font-bold text-white block">4.94 / 5.0</span>
            <span className="text-[11px] font-mono text-[#777777]">Client Trust Score</span>
          </div>
          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#222222]">
            <span className="text-xl font-mono font-bold text-white block">Deed-Checked</span>
            <span className="text-[11px] font-mono text-[#777777]">Anti-Fraud Reviews</span>
          </div>
        </div>
      </section>

      {/* Featured Verified Brokers */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Featured Accredited Advisors
            </h2>
            <p className="text-xs text-[#777777]">Verified brokers with audited closing volumes</p>
          </div>
          <button
            onClick={onExploreBrokers}
            className="text-xs font-mono text-white hover:text-[#CCCCCC] flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {brokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-[#0A0A0A] border border-[#222222] hover:border-[#444444] rounded-xl p-4 flex flex-col justify-between transition-colors group"
            >
              <div>
                <div className="relative mb-3">
                  <img
                    src={broker.avatar}
                    alt={broker.name}
                    className="w-full h-40 rounded-lg object-cover grayscale group-hover:grayscale-0 transition duration-300"
                  />
                  {broker.isVerified && (
                    <span className="absolute top-2 left-2 bg-black/90 border border-[#333333] text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      RERA Valid
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/90 border border-[#333333] text-white text-[11px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    {broker.rating}
                  </span>
                </div>

                <h3 className="font-semibold text-white text-sm">
                  {broker.name}
                </h3>
                <p className="text-[11px] text-[#888888]">{broker.agency}</p>
                <p className="text-[11px] text-[#666666] font-mono mt-1">{broker.location}</p>

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {broker.specializations.slice(0, 2).map((spec) => (
                    <span
                      key={spec}
                      className="px-1.5 py-0.5 rounded bg-[#141414] border border-[#222222] text-[10px] text-[#A0A0A0]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1F1F1F] flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectBroker(broker.id)}
                  className="flex-1 py-1.5 px-3 rounded bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition text-center"
                >
                  Dossier
                </button>
                <button
                  onClick={() => onCompare(broker.id)}
                  className={`p-1.5 rounded border text-xs transition ${
                    comparedIds.includes(broker.id)
                      ? 'bg-white text-black border-white'
                      : 'border-[#2E2E2E] text-[#888888] hover:text-white bg-[#121212]'
                  }`}
                  title="Compare"
                >
                  <Scale className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties (INR) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Curated Prime Listings
            </h2>
            <p className="text-xs text-[#777777]">Exclusive mandates directly represented by verified advisors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.slice(0, 3).map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop.id)}
              className="bg-[#0A0A0A] border border-[#222222] hover:border-[#444444] rounded-xl overflow-hidden cursor-pointer group transition-colors"
            >
              <div className="relative h-48">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/85 font-mono text-white text-[10px] px-2 py-0.5 rounded border border-[#333333]">
                  {prop.type}
                </span>
                <span className="absolute bottom-2.5 right-2.5 bg-white text-black text-xs font-mono font-bold px-2.5 py-1 rounded">
                  {prop.priceFormatted}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-semibold text-white text-sm line-clamp-1">{prop.title}</h3>
                <p className="text-xs text-[#777777] flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-[#999999]" />
                  {prop.address}, {prop.city}
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-[#888888]">
                  <span>{prop.beds} • {prop.sqft} sq ft</span>
                  <span className="text-white">Rep: {prop.brokerName.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BrokerDiscoveryView({
  brokers,
  searchCity,
  setSearchCity,
  searchQuery,
  setSearchQuery,
  selectedSpecialization,
  setSelectedSpecialization,
  minRating,
  setMinRating,
  minExperience,
  setMinExperience,
  selectedLanguage,
  setSelectedLanguage,
  onlyVerified,
  setOnlyVerified,
  onSelectBroker,
  onContactBroker,
  onCompare,
  comparedIds,
  onToggleFavorite,
  favoriteIds
}: {
  brokers: Broker[];
  searchCity: string;
  setSearchCity: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedSpecialization: string;
  setSelectedSpecialization: (val: string) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  minExperience: number;
  setMinExperience: (val: number) => void;
  selectedLanguage: string;
  setSelectedLanguage: (val: string) => void;
  onlyVerified: boolean;
  setOnlyVerified: (val: boolean) => void;
  onSelectBroker: (id: string) => void;
  onContactBroker: (b: Broker) => void;
  onCompare: (id: string) => void;
  comparedIds: string[];
  onToggleFavorite: (id: string) => void;
  favoriteIds: string[];
}) {
  const cities = ['All', 'Mumbai', 'Delhi NCR (Gurugram)', 'Bengaluru', 'Pune'];
  const specs = [
    'All',
    'Sea-Facing Penthouses',
    'Grade-A Commercial',
    'Tech Founders Estates',
    'South Mumbai Heritage',
    'Ultra-HNI Estates',
    'Boutique Villas'
  ];
  const languages = ['All', 'English', 'Hindi', 'Marathi', 'Kannada', 'Punjabi', 'Tamil'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Broker Discovery Directory
        </h1>
        <p className="text-xs text-[#888888] mt-1 font-mono">
          Query verified brokers across Indian regulatory jurisdictions with audited transaction scores.
        </p>
      </div>

      {/* Vercel-Style Filter Deck */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[#777777] font-mono text-[10px] uppercase mb-1">SEARCH BROKER / RERA</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, Agency, RERA ID..."
                className="w-full bg-[#121212] border border-[#282828] rounded-md pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#666666]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#777777] font-mono text-[10px] uppercase mb-1">METROPOLITAN REGION</label>
            <select
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full bg-[#121212] border border-[#282828] rounded-md px-2.5 py-1.5 text-xs text-white"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#777777] font-mono text-[10px] uppercase mb-1">SPECIALIZATION</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full bg-[#121212] border border-[#282828] rounded-md px-2.5 py-1.5 text-xs text-white"
            >
              {specs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#777777] font-mono text-[10px] uppercase mb-1">LANGUAGE SPOKEN</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-[#121212] border border-[#282828] rounded-md px-2.5 py-1.5 text-xs text-white"
            >
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between border-t border-[#1F1F1F] pt-3 gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-[#CCCCCC]">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded accent-white h-3.5 w-3.5"
            />
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              Only RERA-Accredited Mandates
            </span>
          </label>

          <div className="flex items-center gap-2 text-[#777777] font-mono text-[11px]">
            <span>Min Experience:</span>
            {[0, 5, 10].map((exp) => (
              <button
                key={exp}
                onClick={() => setMinExperience(exp)}
                className={`px-2 py-0.5 rounded ${
                  minExperience === exp ? 'bg-white text-black font-semibold' : 'bg-[#141414] text-[#888888] border border-[#262626]'
                }`}
              >
                {exp === 0 ? 'All' : `${exp}+ Yrs`}
              </button>
            ))}
          </div>

          <div className="text-[#888888] font-mono text-[11px]">
            Showing <strong className="text-white">{brokers.length}</strong> brokers
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {brokers.map((broker) => {
          const isSaved = favoriteIds.includes(broker.id);
          const isCompared = comparedIds.includes(broker.id);

          return (
            <div
              key={broker.id}
              className="bg-[#0A0A0A] border border-[#222222] hover:border-[#383838] rounded-xl p-4 transition-colors flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="relative">
                  <img
                    src={broker.avatar}
                    alt={broker.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-[#282828]"
                  />
                  {broker.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white text-black p-0.5 rounded" title="RERA Verified">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      onClick={() => onSelectBroker(broker.id)}
                      className="text-sm font-semibold text-white hover:underline cursor-pointer"
                    >
                      {broker.name}
                    </h3>
                    <span className="font-mono text-[10px] bg-[#141414] border border-[#2B2B2B] px-1.5 py-0.5 rounded text-[#AAAAAA]">
                      {broker.badgeLevel}
                    </span>
                    <span className="text-[11px] font-mono text-[#777777]">
                      {broker.reraNumber}
                    </span>
                  </div>

                  <p className="text-xs text-[#A0A0A0]">{broker.agency} • {broker.title}</p>
                  <p className="text-xs text-[#777777] flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-[#888888]" />
                    {broker.location}
                  </p>

                  <p className="text-xs text-[#888888] line-clamp-1 pt-0.5">
                    {broker.bio}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {broker.specializations.map((spec) => (
                      <span key={spec} className="px-1.5 py-0.5 rounded bg-[#121212] border border-[#222222] text-[10px] text-[#AAAAAA] font-mono">
                        {spec}
                      </span>
                    ))}
                    <span className="px-1.5 py-0.5 rounded bg-[#121212] border border-[#222222] text-[10px] text-[#888888] font-mono">
                      Languages: {broker.languages.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-[#1F1F1F] pt-3 md:pt-0 md:pl-5">
                <div className="text-left md:text-right">
                  <div className="flex items-center md:justify-end gap-1 font-mono text-white text-xs font-bold">
                    <Star className="w-3 h-3 fill-white" />
                    <span>{broker.rating}</span>
                    <span className="text-[#666666] font-normal">({broker.reviewCount})</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#777777] mt-0.5">
                    {broker.dealsClosed} deals • {broker.experienceYears} yrs exp
                  </div>
                  <div className="text-[11px] font-mono text-[#AAAAAA]">
                    Fee: {broker.commissionRate}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleFavorite(broker.id)}
                    className={`p-1.5 rounded border transition ${
                      isSaved ? 'bg-white text-black border-white' : 'border-[#2E2E2E] text-[#888888] hover:text-white bg-[#121212]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-black' : ''}`} />
                  </button>

                  <button
                    onClick={() => onCompare(broker.id)}
                    className={`p-1.5 rounded border text-xs transition ${
                      isCompared ? 'bg-white text-black border-white' : 'border-[#2E2E2E] text-[#888888] hover:text-white bg-[#121212]'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onContactBroker(broker)}
                    className="px-2.5 py-1.5 rounded bg-[#1C1C1C] hover:bg-[#282828] text-white text-xs font-medium border border-[#333333]"
                  >
                    Inquire
                  </button>

                  <button
                    onClick={() => onSelectBroker(broker.id)}
                    className="px-3 py-1.5 rounded bg-white hover:bg-[#E5E5E5] text-black text-xs font-semibold"
                  >
                    Dossier
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrokerCompareView({
  brokerIds,
  allBrokers,
  onRemove,
  onSelectBroker,
  onContactBroker,
  onAddMore
}: {
  brokerIds: string[];
  allBrokers: Broker[];
  onRemove: (id: string) => void;
  onSelectBroker: (id: string) => void;
  onContactBroker: (b: Broker) => void;
  onAddMore: () => void;
}) {
  const comparedBrokers = allBrokers.filter((b) => brokerIds.includes(b.id));

  if (comparedBrokers.length === 0) {
    return (
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-12 text-center max-w-lg mx-auto space-y-3">
        <Scale className="w-8 h-8 text-white mx-auto" />
        <h2 className="text-base font-semibold text-white">No Brokers Selected for Comparison</h2>
        <p className="text-xs text-[#888888]">Select up to 3 accredited brokers to evaluate licensing, past deals, and fees side-by-side.</p>
        <button
          onClick={onAddMore}
          className="px-4 py-2 rounded-md bg-white text-black text-xs font-semibold hover:bg-[#E5E5E5]"
        >
          Browse Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-white" />
            Broker Comparison Matrix ({comparedBrokers.length}/3)
          </h1>
          <p className="text-xs text-[#888888] font-mono mt-0.5">
            Objective side-by-side appraisal across state registrations and transaction track records.
          </p>
        </div>
        {comparedBrokers.length < 3 && (
          <button
            onClick={onAddMore}
            className="px-3 py-1.5 rounded-md bg-[#141414] hover:bg-[#1E1E1E] border border-[#2E2E2E] text-white text-xs font-mono flex items-center gap-1.5 w-fit"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            Add Broker
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparedBrokers.map((broker) => (
          <div
            key={broker.id}
            className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-5 relative flex flex-col justify-between"
          >
            <button
              onClick={() => onRemove(broker.id)}
              className="absolute top-4 right-4 p-1 rounded bg-[#141414] text-[#888888] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={broker.avatar}
                  alt={broker.name}
                  className="w-14 h-14 rounded-lg object-cover border border-[#2E2E2E]"
                />
                <div>
                  <h3 className="font-semibold text-white text-sm">{broker.name}</h3>
                  <p className="text-xs text-[#888888]">{broker.agency}</p>
                  <span className="font-mono text-[10px] text-white block mt-0.5">
                    {broker.badgeLevel}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs pt-3 border-t border-[#1F1F1F] font-mono">
                <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                  <span className="text-[#777777]">RERA Registration</span>
                  <span className="text-white text-[11px] font-semibold">{broker.reraNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                  <span className="text-[#777777]">Rating</span>
                  <span className="text-white flex items-center gap-1 font-bold">
                    <Star className="w-3 h-3 fill-white" />
                    {broker.rating} ({broker.reviewCount})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                  <span className="text-[#777777]">Closed Volume</span>
                  <span className="text-white">{broker.dealsClosed} transactions</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                  <span className="text-[#777777]">Experience</span>
                  <span className="text-white">{broker.experienceYears} Years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                  <span className="text-[#777777]">Primary Base</span>
                  <span className="text-white">{broker.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                  <span className="text-[#777777]">Commission</span>
                  <span className="text-white font-semibold">{broker.commissionRate}</span>
                </div>
                <div className="py-1">
                  <span className="text-[#777777] block mb-1">Languages</span>
                  <span className="text-[#CCCCCC]">{broker.languages.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#1F1F1F] flex flex-col gap-2">
              <button
                onClick={() => onSelectBroker(broker.id)}
                className="w-full py-1.5 rounded bg-[#141414] hover:bg-[#1E1E1E] text-white text-xs border border-[#2B2B2B]"
              >
                View Dossier
              </button>
              <button
                onClick={() => onContactBroker(broker)}
                className="w-full py-1.5 rounded bg-white text-black text-xs font-semibold hover:bg-[#E5E5E5]"
              >
                Inquire & Consult
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrokerDetailView({
  broker,
  allProperties,
  allReviews,
  onBack,
  onContact,
  onCompare,
  isCompared,
  onFavorite,
  isFavorited,
  onOpenReviewModal,
  onSelectProperty
}: {
  broker: Broker;
  allProperties: PropertyListing[];
  allReviews: Review[];
  onBack: () => void;
  onContact: (b: Broker) => void;
  onCompare: (b: Broker) => void;
  isCompared: boolean;
  onFavorite: (b: Broker) => void;
  isFavorited: boolean;
  onOpenReviewModal: (brokerId: string) => void;
  onSelectProperty: (propertyId: string) => void;
}) {
  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#888888] hover:text-white"
      >
        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        Back to Directory
      </button>

      {/* Hero Dossier Card */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-6 relative">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={broker.avatar}
            alt={broker.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border border-[#2E2E2E]"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{broker.name}</h1>
              <span className="font-mono text-[10px] bg-white text-black px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {broker.reraNumber}
              </span>
              <span className="font-mono text-[10px] bg-[#141414] border border-[#2B2B2B] text-[#AAAAAA] px-2 py-0.5 rounded">
                {broker.badgeLevel}
              </span>
            </div>

            <p className="text-xs text-[#A0A0A0]">
              {broker.title} • <span className="text-white font-medium">{broker.agency}</span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#888888] font-mono pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#666666]" />
                {broker.location}
              </span>
              <span className="flex items-center gap-1 text-white font-bold">
                <Star className="w-3.5 h-3.5 fill-white" />
                {broker.rating} ({broker.reviewCount} Verified Reviews)
              </span>
              <span>{broker.dealsClosed} Closings</span>
              <span>{broker.experienceYears} Years Exp</span>
            </div>

            <p className="text-xs text-[#CCCCCC] leading-relaxed pt-2">
              {broker.bio}
            </p>

            <div className="pt-2 flex flex-wrap gap-1.5">
              {broker.specializations.map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-0.5 rounded bg-[#121212] border border-[#222222] font-mono text-[10.5px] text-[#CCCCCC]"
                >
                  {spec}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded bg-[#121212] border border-[#222222] font-mono text-[10.5px] text-[#888888]">
                Languages: {broker.languages.join(', ')}
              </span>
            </div>
          </div>

          {/* Action Deck */}
          <div className="w-full md:w-auto flex md:flex-col gap-2 justify-end">
            <button
              onClick={() => onContact(broker)}
              className="flex-1 md:flex-none px-4 py-2 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Direct Inquiry / Visit
            </button>

            <button
              onClick={() => onCompare(broker)}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-md border text-xs font-mono transition flex items-center justify-center gap-1.5 ${
                isCompared
                  ? 'bg-white text-black border-white'
                  : 'bg-[#121212] border-[#2A2A2A] text-[#CCCCCC] hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              {isCompared ? 'Compared' : 'Compare Broker'}
            </button>

            <button
              onClick={() => onFavorite(broker)}
              className="p-2 rounded-md border border-[#2A2A2A] bg-[#121212] text-xs text-[#CCCCCC] hover:text-white flex items-center justify-center gap-1.5"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white text-white' : ''}`} />
              {isFavorited ? 'Saved' : 'Save Broker'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Listings */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-white tracking-tight font-mono">
          ACTIVE MANDATES REPRESENTED BY {broker.name.toUpperCase()} ({allProperties.length})
        </h2>

        {allProperties.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-6 text-center text-xs text-[#777777]">
            No public mandates currently listed.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => onSelectProperty(prop.id)}
                className="bg-[#0A0A0A] border border-[#222222] hover:border-[#444444] rounded-xl overflow-hidden cursor-pointer group transition-colors"
              >
                <div className="relative h-44">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute bottom-2.5 right-2.5 bg-white text-black font-mono text-xs font-bold px-2 py-0.5 rounded">
                    {prop.priceFormatted}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-white text-xs truncate">{prop.title}</h3>
                  <p className="text-[11px] text-[#777777] font-mono">{prop.address}, {prop.city}</p>
                  <p className="text-[11px] text-[#888888] font-mono pt-1">
                    {prop.beds} • {prop.sqft} sq ft
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Verified Client Reviews */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F1F1F] pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white font-mono">
              CLIENT REVIEWS & SUB-REGISTRAR CLOSING ENDORSEMENTS
            </h2>
            <p className="text-xs text-[#777777]">All ratings reconciled with state registry filings</p>
          </div>
          <button
            onClick={() => onOpenReviewModal(broker.id)}
            className="px-3 py-1.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition flex items-center gap-1 w-fit"
          >
            <Plus className="w-3.5 h-3.5" />
            Write Verified Review
          </button>
        </div>

        <div className="space-y-3">
          {allReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.customerAvatar}
                    alt={rev.customerName}
                    className="w-8 h-8 rounded-full object-cover border border-[#333333]"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      {rev.customerName}
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] font-mono bg-[#141414] border border-[#2A2A2A] text-white px-1.5 py-0.2 rounded">
                          Registry Confirmed
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] font-mono text-[#777777]">
                      {rev.dealType}: {rev.propertyTransacted}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-0.5 text-white text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-white" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#666666]">{rev.date}</span>
                </div>
              </div>

              <p className="text-xs text-[#CCCCCC] leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PropertyMarketplaceView({
  properties,
  propTypeFilter,
  setPropTypeFilter,
  propMaxPrice,
  setPropMaxPrice,
  onSelectProperty,
  onContactBroker,
  onToggleFavorite,
  favoriteIds
}: {
  properties: PropertyListing[];
  propTypeFilter: string;
  setPropTypeFilter: (val: string) => void;
  propMaxPrice: number;
  setPropMaxPrice: (val: number) => void;
  onSelectProperty: (id: string) => void;
  onContactBroker: (broker: Broker, title: string) => void;
  onToggleFavorite: (id: string) => void;
  favoriteIds: string[];
}) {
  const propertyTypes = ['All', 'Sea-Facing Apartment', 'Penthouse', 'Luxury Villa', 'Grade-A Commercial'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Prime Indian Real Estate Mandates
        </h1>
        <p className="text-xs text-[#888888] font-mono mt-1">
          Exclusive residential sky villas and commercial investments represented under RERA mandate.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#777777] font-mono text-[10px] uppercase">Category:</span>
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setPropTypeFilter(type)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                propTypeFilter === type
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#141414] text-[#888888] border border-[#262626] hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#888888]">
          <span>Max Price: ₹{(propMaxPrice / 100).toFixed(1)} Cr</span>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={propMaxPrice}
            onChange={(e) => setPropMaxPrice(Number(e.target.value))}
            className="accent-white w-32"
          />
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map((prop) => {
          const isFavorited = favoriteIds.includes(prop.id);

          return (
            <div
              key={prop.id}
              className="bg-[#0A0A0A] border border-[#222222] hover:border-[#444444] rounded-xl overflow-hidden transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(prop.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded backdrop-blur-md transition ${
                      isFavorited ? 'bg-white text-black' : 'bg-black/70 text-white hover:bg-black'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-black' : ''}`} />
                  </button>
                  <span className="absolute top-2.5 left-2.5 bg-black/85 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-[#333333]">
                    {prop.type}
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 bg-white text-black font-mono font-bold text-xs px-2.5 py-1 rounded">
                    {prop.priceFormatted}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3
                    onClick={() => onSelectProperty(prop.id)}
                    className="font-semibold text-white text-sm hover:underline cursor-pointer truncate"
                  >
                    {prop.title}
                  </h3>
                  <p className="text-xs text-[#777777] flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-[#999999]" />
                    {prop.address}, {prop.city}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#CCCCCC]">
                    <span>{prop.beds}</span>
                    <span>{prop.sqft} sq ft</span>
                  </div>

                  <p className="text-xs text-[#888888] line-clamp-2 pt-1">
                    {prop.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={prop.brokerAvatar}
                      alt={prop.brokerName}
                      className="w-6 h-6 rounded-full object-cover border border-[#333333]"
                    />
                    <span className="text-xs text-[#AAAAAA]">{prop.brokerName}</span>
                  </div>
                  <button
                    onClick={() => onSelectProperty(prop.id)}
                    className="px-2.5 py-1 rounded bg-white text-black text-xs font-semibold hover:bg-[#E5E5E5] transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PropertyDetailView({
  property,
  broker,
  onBack,
  onContactBroker,
  onFavorite,
  isFavorited
}: {
  property: PropertyListing;
  broker: Broker;
  onBack: () => void;
  onContactBroker: (broker: Broker, context: string) => void;
  onFavorite: (id: string) => void;
  isFavorited: boolean;
}) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#888888] hover:text-white"
      >
        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        Back to Listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="relative rounded-xl overflow-hidden h-80 sm:h-96 border border-[#222222]">
            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-black/90 font-mono text-white text-[11px] px-2.5 py-1 rounded border border-[#333333]">
                {property.type}
              </span>
              <span className="bg-white text-black font-mono text-[11px] font-bold px-2.5 py-1 rounded">
                {property.status}
              </span>
            </div>
            <button
              onClick={() => onFavorite(property.id)}
              className={`absolute top-3 right-3 p-2 rounded backdrop-blur-md transition ${
                isFavorited ? 'bg-white text-black' : 'bg-black/75 text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-black' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F1F1F] pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{property.title}</h1>
                <p className="text-xs text-[#777777] mt-1 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  {property.address}, {property.city}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-2xl font-bold font-mono text-white">{property.priceFormatted}</span>
                <span className="text-[11px] font-mono text-[#777777] block">INR Title Clear</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3">
                <span className="text-base font-bold text-white block">{property.beds}</span>
                <span className="text-[11px] text-[#777777]">Configuration</span>
              </div>
              <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3">
                <span className="text-base font-bold text-white block">{property.baths}</span>
                <span className="text-[11px] text-[#777777]">Bathrooms</span>
              </div>
              <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3">
                <span className="text-base font-bold text-white block">{property.sqft}</span>
                <span className="text-[11px] text-[#777777]">Carpet Area (Sq Ft)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-mono font-bold text-[#888888] uppercase">PROPERTY DISCLOSURES & DESCRIPTION</h3>
              <p className="text-xs text-[#CCCCCC] leading-relaxed">{property.description}</p>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-mono font-bold text-[#888888] uppercase">AMENITIES & SPECIFICATIONS</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded bg-[#101010] border border-[#242424] text-[11px] font-mono text-[#CCCCCC] flex items-center gap-1.5"
                  >
                    <Check className="w-3 h-3 text-white" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Exclusive Listing Broker Card */}
        <div>
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-5 sticky top-20 space-y-5">
            <h3 className="text-[11px] font-mono font-bold text-[#777777] uppercase">
              EXCLUSIVE LISTING ADVISOR
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={broker?.avatar || property.brokerAvatar}
                alt={broker?.name || property.brokerName}
                className="w-14 h-14 rounded-lg object-cover border border-[#2E2E2E]"
              />
              <div>
                <h4 className="font-semibold text-white text-sm flex items-center gap-1">
                  {broker?.name || property.brokerName}
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </h4>
                <p className="text-xs text-[#888888]">{broker?.agency || 'RERA Mandate'}</p>
                <div className="flex items-center gap-1 text-white text-xs font-mono mt-0.5">
                  <Star className="w-3 h-3 fill-white" />
                  <span>{broker?.rating || 4.9}</span>
                  <span className="text-[#666666]">({broker?.reviewCount || 40} reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-[#888888]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#555555]" />
                <span className="text-[#CCCCCC]">{broker?.phone || '+91 98200 00000'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#555555]" />
                <span className="text-[#CCCCCC]">{broker?.email || 'advisor@brokervault.in'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>{broker?.reraNumber || 'RERA Registered'}</span>
              </div>
            </div>

            <button
              onClick={() => onContactBroker(broker, `Inquiry on mandate: ${property.title} (${property.priceFormatted})`)}
              className="w-full py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition shadow flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Schedule Private Showing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerPortalView({
  savedBrokers,
  savedProperties,
  conversations,
  onSelectBroker,
  onSelectProperty,
  onOpenChat,
  onRemoveFavoriteBroker,
  onRemoveFavoriteProperty
}: {
  savedBrokers: Broker[];
  savedProperties: PropertyListing[];
  conversations: Conversation[];
  onSelectBroker: (id: string) => void;
  onSelectProperty: (id: string) => void;
  onOpenChat: (convId: string) => void;
  onRemoveFavoriteBroker: (id: string) => void;
  onRemoveFavoriteProperty: (id: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Client Workspace & Saved Portfolios
        </h1>
        <p className="text-xs text-[#888888] font-mono mt-1">
          Review saved brokers, active RERA consultations, and bookmarked residences.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#888888] uppercase">
          ACTIVE BROKER CONSULTATIONS ({conversations.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onOpenChat(conv.id)}
              className="bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] rounded-lg p-3.5 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={conv.brokerAvatar}
                  alt={conv.brokerName}
                  className="w-10 h-10 rounded-full object-cover border border-[#2E2E2E]"
                />
                <div>
                  <h4 className="font-semibold text-white text-xs flex items-center gap-1">
                    {conv.brokerName}
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </h4>
                  <p className="text-[11px] text-[#888888] line-clamp-1">{conv.lastMessage}</p>
                  <span className="text-[10px] font-mono text-[#666666]">{conv.updatedAt}</span>
                </div>
              </div>
              <button className="px-3 py-1 rounded bg-[#1C1C1C] text-white text-xs font-mono border border-[#2E2E2E]">
                Open
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#888888] uppercase">
          SAVED BROKER ADVISORS ({savedBrokers.length})
        </h2>
        {savedBrokers.length === 0 ? (
          <p className="text-xs text-[#666666] font-mono">No brokers saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedBrokers.map((b) => (
              <div key={b.id} className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={b.avatar} alt={b.name} className="w-9 h-9 rounded object-cover" />
                    <div>
                      <h4 className="font-semibold text-white text-xs hover:underline cursor-pointer" onClick={() => onSelectBroker(b.id)}>
                        {b.name}
                      </h4>
                      <p className="text-[11px] text-[#777777]">{b.agency}</p>
                    </div>
                  </div>
                  <button onClick={() => onRemoveFavoriteBroker(b.id)} className="text-[#666666] hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-[#888888] pt-2 border-t border-[#1C1C1C]">
                  <span>Rating: {b.rating}</span>
                  <span>{b.dealsClosed} Deals</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#888888] uppercase">
          SAVED WISHLIST PROPERTIES ({savedProperties.length})
        </h2>
        {savedProperties.length === 0 ? (
          <p className="text-xs text-[#666666] font-mono">No properties saved.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedProperties.map((p) => (
              <div key={p.id} className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 space-y-2">
                <img src={p.image} alt={p.title} className="w-full h-28 rounded object-cover" />
                <div className="flex items-center justify-between">
                  <h4 onClick={() => onSelectProperty(p.id)} className="font-semibold text-white text-xs truncate cursor-pointer hover:underline">
                    {p.title}
                  </h4>
                  <button onClick={() => onRemoveFavoriteProperty(p.id)} className="text-[#666666] hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-[#888888]">
                  <span className="text-white font-bold">{p.priceFormatted}</span>
                  <span>{p.city}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function BrokerPortalView({
  broker,
  properties,
  leads,
  reviews,
  onOpenNewPropertyModal,
  onOpenChat,
  onRequestVerification
}: {
  broker: Broker;
  properties: PropertyListing[];
  leads: Conversation[];
  reviews: Review[];
  onOpenNewPropertyModal: () => void;
  onOpenChat: (convId: string) => void;
  onRequestVerification: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* Broker Profile Header */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img src={broker.avatar} alt={broker.name} className="w-14 h-14 rounded-lg object-cover border border-[#2E2E2E]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white">{broker.name}</h1>
              <span className="font-mono text-[10px] bg-white text-black px-2 py-0.5 rounded font-semibold">
                {broker.isVerified ? 'RERA Verified Mandate' : 'Audit Pending'}
              </span>
            </div>
            <p className="text-xs text-[#888888] font-mono">{broker.agency} • {broker.reraNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!broker.isVerified && (
            <button
              onClick={onRequestVerification}
              className="px-3 py-1.5 rounded bg-[#181818] border border-[#333333] text-white text-xs font-mono hover:bg-[#252525]"
            >
              Request RERA Audit
            </button>
          )}
          <button
            onClick={onOpenNewPropertyModal}
            className="px-3.5 py-1.5 rounded bg-white text-black text-xs font-semibold hover:bg-[#E5E5E5] transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Property Mandate
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3.5">
          <span className="text-xl font-bold text-white block">{properties.length}</span>
          <span className="text-[11px] text-[#777777]">Live Mandates</span>
        </div>
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3.5">
          <span className="text-xl font-bold text-white block">{leads.length}</span>
          <span className="text-[11px] text-[#777777]">Client Inquiries</span>
        </div>
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3.5">
          <span className="text-xl font-bold text-white block">{broker.rating}</span>
          <span className="text-[11px] text-[#777777]">Average Rating</span>
        </div>
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3.5">
          <span className="text-xl font-bold text-white block">{broker.dealsClosed}</span>
          <span className="text-[11px] text-[#777777]">Audited Closings</span>
        </div>
      </div>

      {/* Lead CRM */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#888888] uppercase">
          CLIENT INQUIRIES & LEAD PIPELINE
        </h2>
        <div className="space-y-2">
          {leads.map((l) => (
            <div
              key={l.id}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-xs font-semibold text-white">{l.customerName}</h4>
                <p className="text-xs text-[#888888] line-clamp-1">{l.lastMessage}</p>
                <span className="text-[10px] font-mono text-[#666666]">{l.propertyTitle || 'Consultation'}</span>
              </div>
              <button
                onClick={() => onOpenChat(l.id)}
                className="px-3 py-1.5 rounded bg-white text-black text-xs font-semibold"
              >
                Reply
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Managed Listings */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#888888] uppercase">
          PORTFOLIO MANDATES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {properties.map((p) => (
            <div key={p.id} className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex gap-3">
              <img src={p.image} alt={p.title} className="w-20 h-20 rounded object-cover" />
              <div className="flex-1 space-y-0.5">
                <h4 className="font-semibold text-white text-xs">{p.title}</h4>
                <p className="text-xs font-mono font-bold text-white">{p.priceFormatted}</p>
                <p className="text-[11px] font-mono text-[#777777]">{p.address}, {p.city}</p>
                <span className="inline-block text-[10px] font-mono text-[#AAAAAA]">
                  {p.beds} • {p.sqft} sq ft
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AdminDashboardView({
  brokers,
  properties,
  reviews,
  verificationRequests,
  reports,
  onVerifyBroker,
  onModerateReview,
  onDismissReport
}: {
  brokers: Broker[];
  properties: PropertyListing[];
  reviews: Review[];
  verificationRequests: VerificationRequest[];
  reports: ReportItem[];
  onVerifyBroker: (reqId: string, brokerId: string, approve: boolean) => void;
  onModerateReview: (revId: string, action: 'approve' | 'flag') => void;
  onDismissReport: (repId: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-white" />
          RERA Compliance & Trust Governance Center
        </h1>
        <p className="text-xs text-[#888888] font-mono mt-1">
          Audit state RERA licenses (MahaRERA, HRERA, KRERA), review fraud flags, and manage platform safety.
        </p>
      </div>

      {/* Admin KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3.5">
          <span className="text-xl font-bold text-white block">{brokers.length}</span>
          <span className="text-[11px] text-[#777777]">Total Brokers</span>
        </div>
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3.5">
          <span className="text-xl font-bold text-white block">
            {brokers.filter((b) => b.isVerified).length}
          </span>
          <span className="text-[11px] text-[#777777]">Verified Licenses</span>
        </div>
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3.5">
          <span className="text-xl font-bold text-white block">{verificationRequests.filter((r) => r.status === 'pending').length}</span>
          <span className="text-[11px] text-[#777777]">Pending Audits</span>
        </div>
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3.5">
          <span className="text-xl font-bold text-white block">{reports.length}</span>
          <span className="text-[11px] text-[#777777]">Compliance Flags</span>
        </div>
      </div>

      {/* Pending Broker Licenses Queue */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#888888] uppercase">
          PENDING RERA VERIFICATION APPLICATIONS
        </h2>
        {verificationRequests.length === 0 ? (
          <p className="text-xs text-[#666666] font-mono">No pending verification requests.</p>
        ) : (
          <div className="space-y-2">
            {verificationRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">{req.brokerName}</h4>
                  <p className="text-xs font-mono text-[#888888]">
                    {req.reraNumber} • {req.documentType}
                  </p>
                  <p className="text-[10px] font-mono text-[#666666]">Submitted: {req.submittedDate} — {req.notes}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-[#2B2B2B] bg-[#141414] text-[#AAAAAA]">
                    {req.status}
                  </span>

                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onVerifyBroker(req.id, req.brokerId, true)}
                        className="px-2.5 py-1 rounded bg-white text-black text-xs font-semibold hover:bg-[#E5E5E5]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onVerifyBroker(req.id, req.brokerId, false)}
                        className="px-2.5 py-1 rounded bg-[#181818] border border-[#2E2E2E] text-white text-xs hover:bg-[#252525]"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review Moderation */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#888888] uppercase">
          TRANSACTION REVIEW MODERATION
        </h2>
        <div className="space-y-2">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white">{rev.customerName}</h4>
                  <span className="text-[#666666] text-xs font-mono">Broker ID: {rev.brokerId}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#141414] text-white">
                    {rev.status}
                  </span>
                </div>
                <p className="text-xs text-[#888888] italic">"{rev.comment}"</p>
              </div>

              <div className="flex items-center gap-2">
                {rev.status === 'flagged' ? (
                  <button
                    onClick={() => onModerateReview(rev.id, 'approve')}
                    className="px-2.5 py-1 rounded bg-white text-black text-xs font-semibold"
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    onClick={() => onModerateReview(rev.id, 'flag')}
                    className="px-2.5 py-1 rounded bg-[#181818] border border-[#2E2E2E] text-white text-xs hover:bg-[#252525]"
                  >
                    Flag
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Complaints */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#888888] uppercase">
          COMPLIANCE REPORTS & AUDIT INQUIRIES
        </h2>
        {reports.length === 0 ? (
          <p className="text-xs text-[#666666] font-mono">No active grievances logged.</p>
        ) : (
          <div className="space-y-2">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">{rep.targetTitle} ({rep.type})</h4>
                  <p className="text-xs text-[#888888]">Reason: {rep.reason}</p>
                  <span className="text-[10px] font-mono text-[#666666]">Reported by {rep.reporterName} on {rep.date}</span>
                </div>
                <button
                  onClick={() => onDismissReport(rep.id)}
                  className="px-2.5 py-1 rounded bg-white text-black text-xs font-semibold"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
