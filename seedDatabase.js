const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const AdminUser = require('./models/AdminUser');
const Project = require('./models/Project');
const Service = require('./models/Service');
const About = require('./models/About');
const SectionImage = require('./models/SectionImage');
const ContactSubmission = require('./models/ContactSubmission');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    AdminUser.deleteMany({}),
    Project.deleteMany({}),
    Service.deleteMany({}),
    About.deleteMany({}),
    SectionImage.deleteMany({}),
    ContactSubmission.deleteMany({})
  ]);

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await AdminUser.create({
    email: adminEmail,
    username: adminEmail,
    password: hashedPassword
  });

  await About.create({
    title: 'About Me',
    bio: 'This is your portfolio bio. Update it from the admin panel.',
    photo_url: 'https://picsum.photos/600/800?random=201'
  });

  await Service.insertMany([
    {
      title: 'Cinematography',
      description: 'Cinematic storytelling for events and brands.',
      icon: 'https://picsum.photos/200/200?random=202',
      features: ['4K Capture', 'Color Grading'],
      order_index: 0
    },
    {
      title: 'Photography',
      description: 'Editorial and commercial photography.',
      icon: 'https://picsum.photos/200/200?random=203',
      features: ['Portraits', 'Product Shoots'],
      order_index: 1
    }
  ]);

  await Project.insertMany([
    {
      title: 'Wedding Film',
      description: 'A cinematic wedding story.',
      category: 'wedding-film',
      thumbnail_url: 'https://picsum.photos/1200/800?random=204',
      video_urls: [{ url: 'https://example.com/video-1.mp4', is_primary: true }],
      images: [{ url: 'https://picsum.photos/1200/800?random=205', category: 'final-shot' }],
      featured: true,
      status: 'published',
      order_index: 0
    },
    {
      title: 'Brand Commercial',
      description: 'A commercial campaign cut.',
      category: 'commercial',
      thumbnail_url: 'https://picsum.photos/1200/800?random=206',
      video_urls: [{ url: 'https://example.com/video-2.mp4', is_primary: true }],
      images: [{ url: 'https://picsum.photos/1200/800?random=207', category: 'final-shot' }],
      featured: false,
      status: 'published',
      order_index: 1
    }
  ]);

  await SectionImage.insertMany([
    {
      section: 'hero',
      image_key: 'hero-main',
      image_url: 'https://picsum.photos/1920/1080?random=208',
      alt_text: 'Hero background',
      title: 'Hero',
      order_index: 0,
      is_active: true
    },
    {
      section: 'services',
      image_key: 'services-main',
      image_url: 'https://picsum.photos/1200/800?random=209',
      alt_text: 'Services image',
      title: 'Services',
      order_index: 0,
      is_active: true
    }
  ]);

  await ContactSubmission.create({
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1 234 567 890',
    message: 'Interested in a project collaboration.',
    project_type: 'commercial',
    status: 'pending'
  });

  console.log('Database seeded successfully');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error('Seeding failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
