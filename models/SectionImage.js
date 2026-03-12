const mongoose = require('mongoose');

const sectionImageSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['hero', 'intro', 'philosophy', 'services', 'storytelling', 'work', 'location', 'timeless', 'gallery', 'testimonials', 'team']
  },
  image_key: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  thumbnail_url: {
    type: String,
    default: ''
  },
  alt_text: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['background', 'feature', 'gallery', 'portrait', 'landscape', 'detail', 'concept'],
    default: 'feature'
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    width: Number,
    height: Number,
    file_size: Number,
    format: String,
    color_palette: [String],
    dominant_color: String
  },
  seo_fields: {
    meta_title: String,
    meta_description: String,
    focus_keyword: String
  },
  display_settings: {
    parallax_effect: {
      type: Boolean,
      default: false
    },
    overlay_opacity: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    animation_type: {
      type: String,
      enum: ['none', 'fade', 'slide', 'zoom', 'parallax'],
      default: 'none'
    },
    lazy_load: {
      type: Boolean,
      default: true
    }
  },
  order_index: {
    type: Number,
    default: 0
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  published_at: {
    type: Date,
    default: null
  },
  expires_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound index to ensure unique combination of section and image_key
sectionImageSchema.index({ section: 1, image_key: 1 }, { unique: true });

module.exports = mongoose.model('SectionImage', sectionImageSchema);
