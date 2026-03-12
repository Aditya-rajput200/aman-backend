const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  description: {
    type: String,
    maxlength: 2000
  },
  short_description: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['wedding-film', 'commercial', 'documentary', 'music-video', 'portrait', 'photography', 'fashion', 'event', 'corporate', 'creative']
  },
  subcategory: {
    type: String,
    trim: true
  },
  client: {
    name: String,
    industry: String,
    website: String,
    logo_url: String
  },
  credits: [{
    role: String,
    name: String,
    url: String
  }],
  thumbnail_url: {
    type: String
  },
  poster_url: {
    type: String
  },
  video_urls: [{
    url: String,
    title: String,
    duration: Number, // in seconds
    quality: String, // 1080p, 4K, etc.
    format: String, // mp4, webm, etc.
    is_primary: {
      type: Boolean,
      default: false
    }
  }],
  images: [{
    url: String,
    title: String,
    alt_text: String,
    caption: String,
    category: {
      type: String,
      enum: ['behind-the-scenes', 'final-shot', 'detail', 'concept', 'poster', 'promotion']
    },
    is_featured: {
      type: Boolean,
      default: false
    },
    order_index: Number
  }],
  deliverables: [{
    type: {
      type: String,
      enum: ['video', 'photos', 'album', ' highlights', 'teaser', 'full-edit']
    },
    description: String,
    quantity: Number,
    format: String
  }],
  timeline: {
    start_date: Date,
    end_date: Date,
    duration_days: Number,
    production_phase: {
      type: String,
      enum: ['pre-production', 'production', 'post-production', 'completed', 'delivered']
    }
  },
  location: {
    venue: String,
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  budget: {
    range: {
      type: String,
      enum: ['under-5k', '5k-10k', '10k-25k', '25k-50k', '50k-100k', 'over-100k']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  seo_fields: {
    meta_title: String,
    meta_description: String,
    focus_keyword: String,
    canonical_url: String
  },
  social_media: {
    instagram_url: String,
    youtube_url: String,
    vimeo_url: String,
    facebook_url: String,
    tiktok_url: String
  },
  technical_specs: {
    cameras: [String],
    lenses: [String],
    lighting_equipment: [String],
    software: [String],
    resolution: String,
    frame_rate: String,
    color_grading: String
  },
  awards: [{
    name: String,
    category: String,
    year: Number,
    result: {
      type: String,
      enum: ['winner', 'nominee', 'honorable-mention', 'finalist']
    }
  }],
  testimonials: [{
    client_name: String,
    client_role: String,
    company: String,
    quote: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    date: Date
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'password-protected'],
    default: 'public'
  },
  password: String,
  published_at: Date,
  expires_at: Date,
  order_index: {
    type: Number,
    default: 0
  },
  view_count: {
    type: Number,
    default: 0
  },
  like_count: {
    type: Number,
    default: 0
  },
  share_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from title before saving
projectSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Indexes for better search performance
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });
projectSchema.index({ category: 1, status: 1, featured: -1 });
projectSchema.index({ published_at: -1 });
projectSchema.index({ view_count: -1 });

module.exports = mongoose.model('Project', projectSchema);
