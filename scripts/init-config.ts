// Script to initialize recruitment configuration
// Run this once to set up deadlines in your database

import prisma from '../src/lib/prisma';

async function initializeConfig() {
  try {
    // Create initial recruitment configuration
    const config = await prisma.recruitmentConfig.create({
      data: {
        selectionDeadline: new Date('2025-12-31T23:59:59Z'), // Selection deadline
        round1Deadline: new Date('2026-01-15T23:59:59Z'),   // Round 1 submission deadline
        round2Deadline: new Date('2026-02-15T23:59:59Z'),   // Round 2 submission deadline
        isActive: true,
        maxSelections: 3, // Maximum 3 domain/subdomain selections
      },
    });

    console.log('✅ Recruitment configuration initialized:');
    console.log('   Selection Deadline:', config.selectionDeadline);
    console.log('   Round 1 Deadline:', config.round1Deadline);
    console.log('   Round 2 Deadline:', config.round2Deadline);
    console.log('   Max Selections:', config.maxSelections);
    console.log('\nYou can update these deadlines from the admin panel.');
    
  } catch (error) {
    console.error('❌ Error initializing config:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeConfig();
