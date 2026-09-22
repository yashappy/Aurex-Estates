import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seed...');

  // 1. Seed Admin User
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Aurex@2026';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        username: adminUsername,
        passwordHash,
      },
    });
    console.log(`[Seed] Created admin user: ${adminUsername}`);
  } else {
    await prisma.adminUser.update({
      where: { username: adminUsername },
      data: { passwordHash },
    });
    console.log(`[Seed] Updated admin user password for: ${adminUsername}`);
  }

  // 2. Seed Flagship Projects
  const initialProjects = [
    {
      id: 'the-camellias',
      name: 'DLF The Camellias',
      developer: 'DLF Luxury',
      tagline: 'Super-Luxury Golf Drive Living',
      category: 'residential',
      status: 'Ready to Move',
      location: 'Golf Course Road, Sector 42',
      city: 'Gurugram',
      priceRange: '₹35 Cr - ₹85 Cr',
      priceNumeric: 350000000,
      typology: '4 & 5 BHK Super Luxury Residences & Penthouses',
      size: '7,400 - 16,000 sq.ft.',
      projectArea: '17.5 Acres',
      possessionYear: 'Ready to Move',
      launchYear: '2016',
      description: 'DLF The Camellias stands as one of the most prestigious ultra-luxury residential developments in India, situated on the iconic Golf Course Road. Unrivaled skyline views, 1.3-lakh sq.ft. clubhouse, private lake, and personal concierge services.',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      ]),
      amenities: JSON.stringify([
        'Private 1.3 Lakh Sq.ft Clubhouse',
        'Olympic Size Temperature-Controlled Pool',
        'Exclusive Golf Course Access',
        'Multi-Tier 24/7 High Security',
        'Helipad Access & Valet Services',
      ]),
      highlights: JSON.stringify([
        'Direct Frontage on Golf Course Road',
        'LEED Platinum Certified Architecture',
        'Ceiling Heights of 12.5 Feet',
      ]),
      brochureUrl: '/brochures/dlf-camellias.pdf',
      isFeatured: true,
    },
    {
      id: 'cyber-city-horizon',
      name: 'Horizon Institutional Tower',
      developer: 'DLF Commercial',
      tagline: 'Grade-A Prime Tech & Financial Headquarters',
      category: 'commercial',
      status: 'Ready to Move',
      location: 'DLF Cyber City, Phase II',
      city: 'Gurugram',
      priceRange: '₹12 Cr - ₹50 Cr',
      priceNumeric: 120000000,
      typology: 'Grade-A Scalable Office Suites & Retail Spaces',
      size: '2,500 - 35,000 sq.ft.',
      projectArea: '12 Acres',
      possessionYear: 'Ready to Move',
      launchYear: '2019',
      description: 'Prime Grade-A commercial asset situated in the epicenter of North India’s tech & corporate district. Fully occupied by multinational tenants with stellar capital appreciation and strong rental yield yields.',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      ]),
      amenities: JSON.stringify([
        'Central HVAC with MERV-14 Filtration',
        'Dual Power Grid 100% Redundancy',
        'Rapid Destination Elevators',
        'Ample 4-Level Basements with EV Charging',
      ]),
      highlights: JSON.stringify([
        'Rapid Metro Connectivity at Doorstep',
        'Institutional Grade Multinational Occupancy',
        'High Rental Yield 8.5% - 9.2%',
      ]),
      brochureUrl: '/brochures/horizon-commercial.pdf',
      isFeatured: true,
    },
    {
      id: 'aravali-estate-plots',
      name: 'The Aravali Sovereign Plots',
      developer: 'Aurex Land Assets',
      tagline: 'Freehold Gated Villa Plots amidst Aravali Foothills',
      category: 'plots',
      status: 'New Launch',
      location: 'Sector 63A, Southern Peripheral Road',
      city: 'Gurugram',
      priceRange: '₹4.5 Cr - ₹11 Cr',
      priceNumeric: 45000000,
      typology: '250 - 650 sq.yd. Freehold Plots',
      size: '2,250 - 5,850 sq.ft.',
      projectArea: '40 Acres',
      possessionYear: '2026',
      launchYear: '2024',
      description: 'Rare low-density plotted enclave boasting majestic panoramic views of the Aravali ranges. Gated boundary wall, underground electrical cabling, 4-tier security, and wide 18-meter internal tree-lined boulevards.',
      thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      ]),
      amenities: JSON.stringify([
        'Underground Utilities Infrastructure',
        'Grand Gated Entry Boulevard',
        'Eco-Friendly Rainwater Harvesting',
        'Clubhouse & Sports Courts',
      ]),
      highlights: JSON.stringify([
        '100% Freehold Clear Title with Registry',
        'Seamless Access to Golf Course Extension Road',
        'Uninterrupted Aravali View Corridor',
      ]),
      brochureUrl: null,
      isFeatured: true,
    },
  ];

  for (const proj of initialProjects) {
    await prisma.project.upsert({
      where: { id: proj.id },
      update: proj,
      create: proj,
    });
    console.log(`[Seed] Upserted project: ${proj.name}`);
  }

  // 3. Seed Sample Blog Post
  const blogId = 'gurugram-luxury-real-estate-outlook-2026';
  await prisma.blogPost.upsert({
    where: { id: blogId },
    update: {},
    create: {
      id: blogId,
      title: 'Gurugram Luxury Real Estate Outlook 2026: The Flight to Quality',
      excerpt: 'An in-depth analysis on why high-net-worth investors and NRIs are allocating capital to Grade-A residential and commercial assets along Golf Course Road and SPR.',
      category: 'Market Intelligence',
      readTime: '5 min read',
      date: 'September 2026',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      content: `## The Evolution of Super-Luxury Real Estate in Gurugram\n\nGurugram continues to redefine India's prime property landscape. With rapid infrastructure upgrades such as the Dwarka Expressway and SPR cloverleafs, prime residential yields and capital appreciation have consistently outperformed other metropolitan centers.\n\nInstitutional capital inflows and stringent RERA governance have fueled investor confidence, prioritizing reputed developers with flawless delivery track records.`,
      author: 'Aurex Advisory Desk',
    },
  });
  console.log(`[Seed] Upserted blog post: ${blogId}`);

  console.log('[Seed] Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('[Seed Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
