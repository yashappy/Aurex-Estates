export interface Developer {
  id: string;
  name: string;
  category?: string;
}

// 24 Official Institutional Developers with verified uploaded transparent logo assets
export const DEVELOPERS: Developer[] = [
  { id: 'dlf', name: 'DLF', category: 'Pioneering Luxury' },
  { id: 'oberoi', name: 'Oberoi Realty', category: 'Ultra Luxury' },
  { id: 'godrej', name: 'Godrej Properties', category: 'Sustainable Design' },
  { id: 'sobha', name: 'SOBHA', category: 'Craftsmanship & Quality' },
  { id: 'max', name: 'Max Estates', category: 'Well-being & Luxury' },
  { id: 'birla', name: 'Birla Estates', category: 'Legacy Development' },
  { id: 'emaar', name: 'Emaar', category: 'Global Landmark' },
  { id: 'tata', name: 'Tata Housing', category: 'Trust & Excellence' },
  { id: 'm3m', name: 'M3M', category: 'Magnificence in Trinity' },
  { id: 'mahindra', name: 'Mahindra Lifespaces', category: 'Green Living' },
  { id: 'adani', name: 'Adani Realty', category: 'Infrastructure & Homes' },
  { id: 'ats', name: 'ATS HomeKraft', category: 'Aspirational Living' },
  { id: 'wal', name: 'WAL Developers', category: 'Bespoke Architecture' },
  { id: 'pareena', name: 'Pareena', category: 'Infrastructure & Homes' },
  { id: 'signature', name: 'Signature Global', category: 'High Growth' },
  { id: 'smartworld', name: 'Smart World', category: 'Next-Gen Living' },
  { id: 'puri', name: 'Puri Constructions', category: 'Luxury Living' },
  { id: 'ireo', name: 'IREO', category: 'Masterplanned' },
  { id: 'aipl', name: 'AIPL', category: 'Commercial & Luxury' },
  { id: 'ganga', name: 'Ganga Realty', category: 'Pure Luxury' },
  { id: 'hero', name: 'Hero Homes', category: 'Modern Communities' },
  { id: 'centralpark', name: 'Central Park', category: 'Resort Living' },
  { id: 'bptp', name: 'BPTP', category: 'Integrated Living' },
  { id: 'elan', name: 'Elan Group', category: 'Commercial & Luxury' },
];
