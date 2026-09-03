export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  designation: string;
  location: string;
  context: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'Most brokers in Gurugram immediately push whatever launch pays the highest commission. Aurex Estates did the exact opposite, spending three weeks analyzing floor plan efficiency, builder delivery records, and secondary market pricing before showing us a single unit. They actually advised us against two overhyped projects, saving us significant capital.',
    clientName: 'Rajiv Singhania',
    designation: 'Managing Director, Tech Enterprise',
    location: 'Golf Course Extension Road',
    context: 'End-User Luxury Residence',
  },
  {
    id: 't2',
    quote:
      'When evaluating high-ticket real estate across Delhi NCR, institutional clarity is very hard to find. Aurex Estates provided rigorous corridor infrastructure timelines, unvarnished pricing comps, and structured deal advisory. Their fiduciary discipline is refreshing and rare in this market.',
    clientName: 'Vikramaditya Oberoi',
    designation: 'Senior Partner, Private Equity',
    location: 'Golf Course Road Corridor',
    context: 'Strategic Portfolio Acquisition',
  },
  {
    id: 't3',
    quote:
      'Managing luxury property acquisitions from London felt daunting until we engaged Aurex Estates. Thorough due diligence, zero sugarcoating on developer timelines, and completely transparent negotiation. They negotiated on our behalf as if their own capital was on the line.',
    clientName: 'Ananya & Dev Malhotra',
    designation: 'Family Office Investors',
    location: 'Southern Peripheral Road (SPR)',
    context: 'Cross-Border Capital Deployment',
  },
  {
    id: 't4',
    quote:
      'We were looking for our permanent family home after relocation. What impressed us most was their patience, with no false urgency and no pushy sales pitches. Aurex Estates took time to understand our living priorities and guided us to a community that genuinely matches our family’s future.',
    clientName: 'Harpreet Singh',
    designation: 'Corporate CXO & Homeowner',
    location: 'New Gurugram',
    context: 'End-User Advisory',
  },
];
