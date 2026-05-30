import type { Charm, CharmId } from "./types";

export const CHARMS: Record<CharmId, Charm> = {
  coffee: {
    id: "coffee",
    label: "Coffee",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#FFF8F0"/>
      <path d="M18 28h20l-3 16H21L18 28z" fill="#C8864A" stroke="#8B5A2B" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M38 32h4a4 4 0 0 1 0 8h-4" stroke="#8B5A2B" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M22 24c0-3 4-3 4-6" stroke="#C8864A" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M28 24c0-3 4-3 4-6" stroke="#C8864A" stroke-width="1.5" stroke-linecap="round"/>
      <rect x="15" y="44" width="26" height="3" rx="1.5" fill="#8B5A2B"/>
    </svg>`,
  },
  dinner: {
    id: "dinner",
    label: "Dinner",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#FFF5F5"/>
      <circle cx="32" cy="34" r="14" fill="#FFECD2" stroke="#E8875A" stroke-width="1.5"/>
      <path d="M24 20v-6M24 20a8 8 0 0 0 0 16" stroke="#E8875A" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M40 14v10a4 4 0 0 1-4 4" stroke="#E8875A" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="32" cy="34" r="5" fill="#E8875A"/>
    </svg>`,
  },
  party: {
    id: "party",
    label: "Party",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#FFF0F8"/>
      <path d="M16 48L32 16l16 32H16z" fill="#FFB3D9" stroke="#E05DA0" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M32 16l-3-5" stroke="#E05DA0" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="32" cy="9" r="3" fill="#FFE066"/>
      <circle cx="20" cy="22" r="2" fill="#A78BFA"/>
      <circle cx="44" cy="26" r="2" fill="#67E8F9"/>
      <circle cx="38" cy="16" r="1.5" fill="#FF8A65"/>
    </svg>`,
  },
  movie: {
    id: "movie",
    label: "Movie",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#F0F0FF"/>
      <rect x="12" y="18" width="40" height="28" rx="4" fill="#5C3D2A" stroke="#3B2010" stroke-width="1.5"/>
      <rect x="12" y="18" width="40" height="5" rx="2" fill="#2E1608"/>
      <circle cx="18" cy="20.5" r="1.5" fill="#FFE066"/>
      <circle cx="24" cy="20.5" r="1.5" fill="#FFE066"/>
      <path d="M28 32l10-5-10-5v10z" fill="#FFE066"/>
    </svg>`,
  },
  travel: {
    id: "travel",
    label: "Travel",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#F0FAFF"/>
      <path d="M32 12C22 12 14 20 14 30s6 18 18 22c12-4 18-12 18-22S42 12 32 12z" fill="#BAE6FD" stroke="#0284C7" stroke-width="1.5"/>
      <path d="M14 30h36M32 12v40" stroke="#0284C7" stroke-width="1"/>
      <path d="M18 20c5 3 9 7 14 10-5 3-9 7-14 10" stroke="#0284C7" stroke-width="1" fill="none"/>
      <path d="M46 20c-5 3-9 7-14 10 5 3 9 7 14 10" stroke="#0284C7" stroke-width="1" fill="none"/>
    </svg>`,
  },
  picnic: {
    id: "picnic",
    label: "Picnic",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#F0FDF4"/>
      <rect x="12" y="40" width="40" height="4" rx="2" fill="#16A34A" opacity="0.3"/>
      <path d="M14 40h36" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/>
      <rect x="18" y="32" width="28" height="8" rx="2" fill="#FDE68A" stroke="#CA8A04" stroke-width="1.5"/>
      <path d="M18 36h28" stroke="#CA8A04" stroke-width="1" stroke-dasharray="3 2"/>
      <path d="M32 36V28" stroke="#CA8A04" stroke-width="1.5"/>
      <circle cx="26" cy="25" r="5" fill="#FCA5A5" stroke="#DC2626" stroke-width="1.5"/>
      <circle cx="38" cy="25" r="5" fill="#86EFAC" stroke="#16A34A" stroke-width="1.5"/>
    </svg>`,
  },
  concert: {
    id: "concert",
    label: "Concert",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#1A0533"/>
      <path d="M20 46V30l10-4v16" stroke="#C084FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="16" cy="46" r="4" fill="#9333EA" stroke="#C084FC" stroke-width="1.5"/>
      <circle cx="26" cy="46" r="4" fill="#9333EA" stroke="#C084FC" stroke-width="1.5"/>
      <path d="M34 42V24l10-4v18" stroke="#F0ABFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="30" cy="42" r="4" fill="#A855F7" stroke="#F0ABFC" stroke-width="1.5"/>
      <circle cx="40" cy="42" r="4" fill="#A855F7" stroke="#F0ABFC" stroke-width="1.5"/>
      <circle cx="20" cy="18" r="2" fill="#FFE066" opacity="0.8"/>
      <circle cx="44" cy="14" r="2" fill="#67E8F9" opacity="0.8"/>
    </svg>`,
  },
  date: {
    id: "date",
    label: "Date",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#FFF0F6"/>
      <path d="M32 48s-16-10-16-22a16 16 0 0 1 32 0c0 12-16 22-16 22z" fill="#FDA4AF" stroke="#E11D48" stroke-width="1.5"/>
      <path d="M32 20c0-4 4-6 4-6s0 4-4 6z" fill="#E11D48" opacity="0.5"/>
    </svg>`,
  },
  friends: {
    id: "friends",
    label: "Friends",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#FFFBEB"/>
      <circle cx="22" cy="24" r="8" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/>
      <circle cx="42" cy="24" r="8" fill="#A7F3D0" stroke="#059669" stroke-width="1.5"/>
      <path d="M10 48c0-7 5-10 12-10M54 48c0-7-5-10-12-10M26 48c0-7 3-10 6-10s6 3 6 10" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  spa: {
    id: "spa",
    label: "Spa",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#F5F0FF"/>
      <path d="M32 44c-8 0-14-4-14-10 0-4 3-7 6-9-1 3 0 6 2 8 1-4 3-8 6-10 3 2 5 6 6 10 2-2 3-5 2-8 3 2 6 5 6 9 0 6-6 10-14 10z" fill="#DDD6FE" stroke="#7C3AED" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M25 50h14" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  book: {
    id: "book",
    label: "Book Club",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#FFF7ED"/>
      <rect x="16" y="14" width="24" height="36" rx="2" fill="#FED7AA" stroke="#EA580C" stroke-width="1.5"/>
      <rect x="18" y="14" width="4" height="36" fill="#FB923C" rx="1"/>
      <path d="M24 22h12M24 28h12M24 34h8" stroke="#EA580C" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M40 20h8v28l-4-3-4 3V20z" fill="#FCA5A5" stroke="#DC2626" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`,
  },
  art: {
    id: "art",
    label: "Art",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#F0FFFE"/>
      <circle cx="32" cy="32" r="16" fill="white" stroke="#0D9488" stroke-width="1.5"/>
      <circle cx="26" cy="28" r="4" fill="#FB7185"/>
      <circle cx="38" cy="28" r="4" fill="#60A5FA"/>
      <circle cx="26" cy="38" r="4" fill="#FBBF24"/>
      <circle cx="38" cy="38" r="4" fill="#A78BFA"/>
      <circle cx="32" cy="32" r="3" fill="#34D399"/>
    </svg>`,
  },
  sports: {
    id: "sports",
    label: "Sports",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#F0FFF4"/>
      <circle cx="32" cy="32" r="16" fill="white" stroke="#16A34A" stroke-width="1.5"/>
      <path d="M32 16c0 9-5 14-5 16s5 7 5 16" stroke="#16A34A" stroke-width="1"/>
      <path d="M16 32c9 0 14-5 16-5s7 5 16 5" stroke="#16A34A" stroke-width="1"/>
      <path d="M20 20c5 4 8 8 12 12s7 8 12 12" stroke="#16A34A" stroke-width="1"/>
      <path d="M44 20c-5 4-8 8-12 12s-7 8-12 12" stroke="#16A34A" stroke-width="1"/>
    </svg>`,
  },
  birthday: {
    id: "birthday",
    label: "Birthday",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#FFF8F0"/>
      <rect x="16" y="34" width="32" height="18" rx="3" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/>
      <path d="M16 40h32" stroke="#D97706" stroke-width="1"/>
      <path d="M28 34V28" stroke="#D97706" stroke-width="1.5"/>
      <path d="M36 34V28" stroke="#D97706" stroke-width="1.5"/>
      <ellipse cx="28" cy="26" rx="3" ry="4" fill="#FDA4AF" stroke="#E11D48" stroke-width="1.5"/>
      <ellipse cx="36" cy="26" rx="3" ry="4" fill="#A7F3D0" stroke="#059669" stroke-width="1.5"/>
      <circle cx="22" cy="34" r="1.5" fill="#F59E0B"/>
      <circle cx="32" cy="34" r="1.5" fill="#F59E0B"/>
      <circle cx="42" cy="34" r="1.5" fill="#F59E0B"/>
    </svg>`,
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#FFF7ED"/>
      <path d="M12 40h40" stroke="#F97316" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M32 40a12 12 0 0 1-12-12h24a12 12 0 0 1-12 12z" fill="#FDBA74" stroke="#F97316" stroke-width="1.5"/>
      <path d="M32 20V14M20 24l-4-4M44 24l4-4M16 36h-4M52 36h-4" stroke="#F97316" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M12 44h40" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  garden: {
    id: "garden",
    label: "Garden",
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#F0FDF4"/>
      <path d="M32 48V28" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 36c0-6 6-10 6-10s0 6-6 10z" fill="#4ADE80" stroke="#16A34A" stroke-width="1.5"/>
      <path d="M32 30c0-6-6-10-6-10s0 6 6 10z" fill="#4ADE80" stroke="#16A34A" stroke-width="1.5"/>
      <circle cx="32" cy="22" r="6" fill="#FDE68A" stroke="#CA8A04" stroke-width="1.5"/>
      <circle cx="24" cy="30" r="5" fill="#FCA5A5" stroke="#DC2626" stroke-width="1.5"/>
      <circle cx="40" cy="30" r="5" fill="#C4B5FD" stroke="#7C3AED" stroke-width="1.5"/>
      <path d="M18 48h28" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
};

export const CHARM_LIST = Object.values(CHARMS);
