import type { ImageSourcePropType } from 'react-native';
import { Plane, Train, Car, type LucideIcon } from 'lucide-react-native';

export const VENUE = {
  name: 'Pt. Deendayal Upadhyay Auditorium',
  address: 'G.E. Road, Raipur, C.G. — 492001',
  lat: 21.2514,
  lng: 81.6296,
  features: [
    'Large auditorium seating 1000+',
    'Multiple breakout halls',
    'Central air-conditioning',
    'Ample parking facility',
    'Accessible for differently-abled',
  ],
};

export interface TransportOption {
  icon: LucideIcon;
  label: string;
  title: string;
  details: string[];
}

export const TRANSPORT: TransportOption[] = [
  {
    icon: Plane,
    label: 'By Air',
    title: 'Swami Vivekananda Airport (RPR)',
    details: ['~15 km from venue', 'Flights from Delhi, Mumbai, Hyderabad, Kolkata, Bengaluru', 'Taxi/cab easily available'],
  },
  {
    icon: Train,
    label: 'By Train',
    title: 'Raipur Junction Railway Station',
    details: ['~5 km from venue', 'On Mumbai–Howrah & Delhi–Chennai rail corridors', 'Shatabdi, Rajdhani, Duronto connectivity'],
  },
  {
    icon: Car,
    label: 'By Road',
    title: 'National Highway Connectivity',
    details: ['NH 30 (Raipur–Jagdalpur)', 'NH 53 (Raipur–Nagpur)', 'State bus services from all CG districts'],
  },
];

export interface Hotel {
  name: string;
  stars: number;
  distance: string;
  area: string;
}

export const HOTELS: Hotel[] = [
  { name: 'Hotel Babylon International', stars: 4, distance: '1.2 km', area: 'GE Road' },
  { name: 'Hotel Piccadily', stars: 4, distance: '2.0 km', area: 'Fafadih' },
  { name: 'Hotel Nanking', stars: 3, distance: '0.8 km', area: 'GE Road' },
  { name: 'Hotel Celebration', stars: 3, distance: '1.5 km', area: 'Shankar Nagar' },
  { name: 'OYO / Budget Guesthouses', stars: 2, distance: '0.5–2 km', area: 'Near Venue' },
];

export interface CuisineItem {
  name: string;
  desc: string;
  icon: string;
}

export const CUISINE: CuisineItem[] = [
  { name: 'Chila', desc: 'Rice flour pancakes — a Chhattisgarhi breakfast staple', icon: '🥞' },
  { name: 'Bafauri', desc: 'Steamed dal dumplings, light and nutritious', icon: '🍥' },
  { name: 'Aamat', desc: 'Spicy vegetable curry with Bastar forest ingredients', icon: '🍲' },
  { name: 'Muthia', desc: 'Spiced dumplings in tangy mustard gravy', icon: '🥣' },
  { name: 'Fara', desc: 'Steamed rice rolls with spicy stuffing', icon: '🌯' },
  { name: 'Kusli', desc: 'Deep-fried sweet snack, perfect for celebrations', icon: '🍩' },
];

export interface RaipurPlace {
  name: string;
  description: string;
  icon: string;
  image: ImageSourcePropType;
}

export const RAIPUR_PLACES: RaipurPlace[] = [
  {
    name: 'Chitrakote Falls',
    description: "India's widest waterfall — the horseshoe-shaped 'Niagara of India' on the Indravati River.",
    icon: '💦',
    image: require('../../assets/venue/chitrakote-falls.jpg'),
  },
  {
    name: 'Tirathgarh Waterfall',
    description: 'A multi-tiered cascade inside Kanger Valley National Park, framed by dense sal forest.',
    icon: '💧',
    image: require('../../assets/venue/tirathgarh-waterfall.jpg'),
  },
  {
    name: 'Kanger Valley National Park',
    description: "A biosphere reserve of caves, waterfalls and rare orchids deep in Bastar's forests.",
    icon: '🌳',
    image: require('../../assets/venue/kanger-valley-national-park.jpg'),
  },
  {
    name: 'Kotumsar Caves',
    description: 'Ancient limestone caves with striking stalactite and stalagmite formations.',
    icon: '🦇',
    image: require('../../assets/venue/kotumsar-caves.jpeg'),
  },
  {
    name: 'Ratanpur Fort',
    description: 'A Kalachuri-era fort and temple town, once capital of the ancient Chhattisgarh kingdom.',
    icon: '🏰',
    image: require('../../assets/venue/ratanpur-fort.jpg'),
  },
  {
    name: 'Gaurighat',
    description: 'A tranquil riverside ghat and waterfall pool, a favourite escape near Raipur.',
    icon: '🌅',
    image: require('../../assets/venue/gaurighat.jpg'),
  },
];
