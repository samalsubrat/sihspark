import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Indian names and locations
const indianNames = [
  'Priya Sharma', 'Rajesh Kumar', 'Anita Singh', 'Vikram Patel', 'Sunita Gupta',
  'Amit Kumar', 'Deepika Reddy', 'Suresh Yadav', 'Kavita Joshi', 'Ravi Verma',
  'Pooja Agarwal', 'Manoj Tiwari', 'Sneha Iyer', 'Arjun Nair', 'Meera Das',
  'Kiran Malhotra', 'Rohit Jain', 'Shilpa Rao', 'Nikhil Shah', 'Preeti Mehta',
  'Vishal Agarwal', 'Ritu Singh', 'Sandeep Kumar', 'Neha Choudhary', 'Ajay Pandey'
];

const indianLocations = [
  'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal',
  'Hyderabad, Telangana', 'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh',
  'Kanpur, Uttar Pradesh', 'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh',
  'Visakhapatnam, Andhra Pradesh', 'Pimpri-Chinchwad, Maharashtra', 'Patna, Bihar', 'Vadodara, Gujarat', 'Ghaziabad, Uttar Pradesh',
  'Ludhiana, Punjab', 'Agra, Uttar Pradesh', 'Nashik, Maharashtra', 'Faridabad, Haryana', 'Meerut, Uttar Pradesh'
];

const waterbodyNames = [
  'Ganga River', 'Yamuna River', 'Godavari River', 'Krishna River', 'Narmada River',
  'Indus River', 'Brahmaputra River', 'Mahanadi River', 'Kaveri River', 'Tapti River',
  'Chambal River', 'Betwa River', 'Son River', 'Damodar River', 'Tungabhadra River',
  'Sabarmati River', 'Mahi River', 'Periyar River', 'Bharathapuzha River', 'Pamba River',
  'Vembanad Lake', 'Chilika Lake', 'Pulicat Lake', 'Sambhar Lake', 'Wular Lake'
];

const reportTitles = [
  'Water Pollution in Local Pond', 'Sewage Disposal Issue', 'Industrial Waste Dumping', 'Groundwater Contamination',
  'River Water Quality Deterioration', 'Lake Eutrophication Problem', 'Chemical Spill in Water Body',
  'Agricultural Runoff Pollution', 'Municipal Waste in River', 'Oil Spill in Coastal Area',
  'Heavy Metal Contamination', 'Bacterial Infection in Water', 'Algal Bloom in Lake',
  'Pesticide Runoff Issue', 'Sewage Treatment Plant Malfunction', 'Industrial Effluent Discharge',
  'Groundwater Depletion', 'Water Body Encroachment', 'Solid Waste in River', 'Chemical Plant Leakage',
  'Mining Waste Disposal', 'Urban Runoff Pollution', 'Agricultural Chemical Spill', 'Hospital Waste Disposal',
  'Plastic Waste in Water Body'
];

const hotspotNames = [
  'Industrial Area Water Contamination', 'Sewage Treatment Plant Overflow', 'Chemical Factory Discharge',
  'Mining Site Water Pollution', 'Agricultural Runoff Zone', 'Urban Slum Water Crisis',
  'River Bank Encroachment', 'Groundwater Depletion Zone', 'Coastal Water Pollution',
  'Lake Eutrophication Area', 'Industrial Effluent Disposal', 'Municipal Waste Dumping',
  'Chemical Storage Leakage', 'Oil Refinery Discharge', 'Textile Industry Pollution',
  'Pharmaceutical Waste Disposal', 'Electronics Waste Dumping', 'Food Processing Effluent',
  'Tannery Waste Discharge', 'Paper Mill Pollution', 'Sugar Mill Effluent',
  'Distillery Waste Disposal', 'Fertilizer Plant Discharge', 'Pesticide Manufacturing Waste',
  'Petrochemical Plant Leakage'
];

const playbookTitles = [
  'Water Quality Testing Guidelines', 'Community Water Management', 'Pollution Prevention Measures',
  'Emergency Water Treatment', 'Groundwater Conservation', 'River Cleanup Procedures',
  'Waste Disposal Best Practices', 'Water Conservation Techniques', 'Community Awareness Programs',
  'Water Testing Equipment Usage', 'Pollution Source Identification', 'Water Treatment Methods',
  'Environmental Impact Assessment', 'Community Engagement Strategies', 'Water Quality Monitoring',
  'Emergency Response Procedures', 'Sustainable Water Practices', 'Water Resource Management',
  'Pollution Control Measures', 'Community Health Education', 'Water Safety Protocols',
  'Environmental Protection Guidelines', 'Water Quality Standards', 'Community Action Plans',
  'Water Conservation Education'
];

const storyTitles = [
  'Success Story: Community Water Cleanup', 'Transformation of Polluted Lake', 'Village Water Conservation Success',
  'Youth Initiative for Water Quality', 'Women Leading Water Management', 'School Water Awareness Program',
  'Industrial Area Water Revival', 'River Restoration Project', 'Groundwater Recharge Success',
  'Community Water Testing Program', 'Pollution Prevention Success', 'Water Quality Improvement Story',
  'Environmental Education Impact', 'Community Health Improvement', 'Water Conservation Achievement',
  'Youth Water Activism', 'Women Water Warriors', 'School Water Project', 'Village Water Revolution',
  'Industrial Water Responsibility', 'River Cleanup Success', 'Groundwater Protection Story',
  'Community Water Leadership', 'Water Quality Victory', 'Environmental Success Story'
];

const testimonialContent = [
  'This platform helped our community identify and solve water pollution issues effectively.',
  'The water testing features are very user-friendly and provide accurate results.',
  'Our village water quality has improved significantly after using this system.',
  'The community engagement features helped us organize better water management programs.',
  'Real-time alerts about water quality issues have been very helpful for our area.',
  'The educational content on water conservation is excellent and easy to understand.',
  'This platform connected us with other communities facing similar water challenges.',
  'The reporting system made it easy to document and track water quality improvements.',
  'Our school children learned a lot about water conservation through this platform.',
  'The mobile app makes it convenient to report water issues from anywhere.',
  'The data visualization features help us understand water quality trends better.',
  'This platform empowered our community to take action on water pollution.',
  'The collaboration tools helped us work with local authorities effectively.',
  'Our water testing results are now more reliable and consistent.',
  'The platform helped us create awareness about water conservation in our area.',
  'We successfully cleaned up our local pond using the guidelines from this platform.',
  'The community features helped us organize regular water quality monitoring.',
  'This platform made water quality data accessible to everyone in our community.',
  'The educational resources helped us understand the importance of clean water.',
  'Our village water committee became more effective with this platform.',
  'The reporting system helped us get government attention for water issues.',
  'This platform connected us with experts who helped solve our water problems.',
  'The data tracking features helped us measure the impact of our water conservation efforts.',
  'Our community water quality has improved by 80% since using this platform.',
  'This platform is a game-changer for water quality management in rural areas.'
];

const authorNames = [
  'Dr. Priya Sharma', 'Rajesh Kumar', 'Anita Singh', 'Prof. Vikram Patel', 'Sunita Gupta',
  'Dr. Amit Kumar', 'Deepika Reddy', 'Suresh Yadav', 'Kavita Joshi', 'Ravi Verma',
  'Pooja Agarwal', 'Manoj Tiwari', 'Sneha Iyer', 'Arjun Nair', 'Meera Das',
  'Dr. Kiran Malhotra', 'Rohit Jain', 'Shilpa Rao', 'Nikhil Shah', 'Preeti Mehta',
  'Vishal Agarwal', 'Ritu Singh', 'Sandeep Kumar', 'Neha Choudhary', 'Ajay Pandey'
];

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.testimonial.deleteMany();
  await prisma.story.deleteMany();
  await prisma.playbook.deleteMany();
  await prisma.hotspot.deleteMany();
  await prisma.globalAlert.deleteMany();
  await prisma.leaderAlert.deleteMany();
  await prisma.waterTest.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create users
  const users = [];
  for (let i = 0; i < 25; i++) {
    const role = i < 5 ? 'admin' : i < 10 ? 'leader' : i < 15 ? 'asha' : 'public';
    const user = await prisma.user.create({
      data: {
        name: indianNames[i],
        email: `user${i + 1}@example.com`,
        password: 'hashedpassword123',
        location: indianLocations[i],
        role: role,
      },
    });
    users.push(user);
  }
  console.log('Created 25 users');

  // Create reports
  const reports = [];
  for (let i = 0; i < 25; i++) {
    const leader = users.find(u => u.role === 'leader') || users[0];
    const report = await prisma.report.create({
      data: {
        name: reportTitles[i],
        location: indianLocations[i],
        latitude: 19.0760 + (Math.random() - 0.5) * 0.1,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.1,
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        mapArea: {
          type: 'Polygon',
          coordinates: [[
            [72.8777, 19.0760],
            [72.8778, 19.0761],
            [72.8779, 19.0760],
            [72.8777, 19.0760]
          ]]
        },
        photoUrl: `https://example.com/photos/report${i + 1}.jpg`,
        comment: `Report comment for ${reportTitles[i]} in ${indianLocations[i]}`,
        leaderId: leader.id,
        status: ['awaiting', 'in_progress', 'resolved'][Math.floor(Math.random() * 3)],
        progress: Math.floor(Math.random() * 101),
      },
    });
    reports.push(report);
  }
  console.log('Created 25 reports');

  // Create water tests
  const waterTests = [];
  for (let i = 0; i < 25; i++) {
    const asha = users.find(u => u.role === 'asha') || users[0];
    const waterTest = await prisma.waterTest.create({
      data: {
        waterbodyName: waterbodyNames[i],
        waterbodyId: `WB${i + 1}`,
        dateTime: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        location: indianLocations[i],
        latitude: 19.0760 + (Math.random() - 0.5) * 0.1,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.1,
        photoUrl: `https://example.com/photos/watertest${i + 1}.jpg`,
        notes: `Water quality test notes for ${waterbodyNames[i]} in ${indianLocations[i]}`,
        quality: ['good', 'medium', 'high', 'disease'][Math.floor(Math.random() * 4)],
        ashaId: asha.id,
      },
    });
    waterTests.push(waterTest);
  }
  console.log('Created 25 water tests');

  // Create leader alerts
  for (let i = 0; i < 25; i++) {
    const leader = users.find(u => u.role === 'leader') || users[0];
    const waterTest = waterTests[i];
    await prisma.leaderAlert.create({
      data: {
        leaderId: leader.id,
        message: `Alert: Water quality issue detected in ${waterTest.waterbodyName} - ${waterTest.quality} quality level`,
        waterTestId: waterTest.id,
      },
    });
  }
  console.log('Created 25 leader alerts');

  // Create global alerts
  for (let i = 0; i < 25; i++) {
    const waterTest = waterTests[i];
    await prisma.globalAlert.create({
      data: {
        message: `Global Alert: Critical water quality issue in ${waterTest.waterbodyName} at ${waterTest.location}`,
        waterTestId: waterTest.id,
      },
    });
  }
  console.log('Created 25 global alerts');

  // Create hotspots
  for (let i = 0; i < 25; i++) {
    const user = users[i];
    await prisma.hotspot.create({
      data: {
        name: hotspotNames[i],
        description: `Description for ${hotspotNames[i]} in ${indianLocations[i]}`,
        location: indianLocations[i],
        latitude: 19.0760 + (Math.random() - 0.5) * 0.1,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.1,
        createdById: user.id,
      },
    });
  }
  console.log('Created 25 hotspots');

  // Create playbooks
  for (let i = 0; i < 25; i++) {
    const user = users[i];
    await prisma.playbook.create({
      data: {
        title: playbookTitles[i],
        content: `Detailed content for ${playbookTitles[i]}. This playbook provides comprehensive guidelines for water quality management, community engagement, and environmental protection. It includes step-by-step procedures, best practices, and implementation strategies that have been proven effective in Indian communities.`,
        source: i < 15 ? 'local' : 'llm',
        createdById: user.id,
      },
    });
  }
  console.log('Created 25 playbooks');

  // Create stories
  for (let i = 0; i < 25; i++) {
    const user = users[i];
    await prisma.story.create({
      data: {
        title: storyTitles[i],
        content: `This is the story of ${storyTitles[i]}. It describes how our community came together to address water quality challenges and achieved remarkable results. The story highlights the importance of community participation, innovative solutions, and sustained efforts in water conservation and quality improvement.`,
        source: i < 15 ? 'local' : 'llm',
        createdById: user.id,
      },
    });
  }
  console.log('Created 25 stories');

  // Create testimonials
  for (let i = 0; i < 25; i++) {
    const user = users[i];
    await prisma.testimonial.create({
      data: {
        content: testimonialContent[i],
        authorName: authorNames[i],
        userId: user.id,
      },
    });
  }
  console.log('Created 25 testimonials');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
