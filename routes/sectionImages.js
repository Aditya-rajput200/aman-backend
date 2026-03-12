const express = require('express');
const router = express.Router();
const SectionImage = require('../models/SectionImage');
const { serializeSectionImage } = require('../utils/serializers');
const { requireAdminAuth } = require('../middleware/adminAuth');

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const LANDING_COMPONENT_IMAGE_KEYS = {
  hero: ['hero-bg'],
  intro: ['intro-image'],
  philosophy: ['philosophy-bg'],
  services: [
    'service-cinematography',
    'service-storytelling',
    'service-editing',
    'service-photography',
    'service-motion',
    'service-art'
  ],
  storytelling: ['story-1', 'story-2', 'story-3', 'story-4'],
  work: ['work-1', 'work-2', 'work-3', 'work-4', 'work-5'],
  location: ['location-bg'],
  timeless: ['timeless-bg']
};

const normalizeImagePayload = (body = {}) => {
  const payload = {
    ...body,
    order_index: toNumber(body.order_index, 0),
    is_featured: body.is_featured === true || body.is_featured === 'true',
    is_active: body.is_active !== false
  };

  if (typeof body.tags === 'string') {
    payload.tags = body.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return payload;
};

// GET all section images
router.get('/', async (req, res) => {
  try {
    const images = await SectionImage.find({ is_active: true }).sort({ section: 1, order_index: 1 });
    res.json(images.map(serializeSectionImage));
  } catch (error) {
    console.error('Error fetching section images:', error);
    res.status(500).json({ error: 'Failed to fetch section images' });
  }
});

// GET images by section
router.get('/section/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const images = await SectionImage.find({ section, is_active: true }).sort({ order_index: 1 });
    res.json(images.map(serializeSectionImage));
  } catch (error) {
    console.error('Error fetching section images:', error);
    res.status(500).json({ error: 'Failed to fetch section images' });
  }
});

// GET single image by section + key
router.get('/section/:section/key/:image_key', async (req, res) => {
  try {
    const { section, image_key } = req.params;
    const image = await SectionImage.findOne({ section, image_key, is_active: true });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(serializeSectionImage(image));
  } catch (error) {
    console.error('Error fetching section image:', error);
    res.status(500).json({ error: 'Failed to fetch section image' });
  }
});

// GET landing page component image map for admin
router.get('/admin/landing-components', requireAdminAuth, async (req, res) => {
  try {
    const images = await SectionImage.find({ is_active: true }).sort({ section: 1, order_index: 1 });
    const serializedImages = images.map(serializeSectionImage);

    const components = Object.entries(LANDING_COMPONENT_IMAGE_KEYS).map(([section, keys]) => ({
      section,
      keys: keys.map((image_key) => {
        const image = serializedImages.find((entry) => entry.section === section && entry.image_key === image_key);
        return {
          image_key,
          exists: Boolean(image),
          image: image || null
        };
      })
    }));

    res.json({
      components,
      required_keys: LANDING_COMPONENT_IMAGE_KEYS
    });
  } catch (error) {
    console.error('Error fetching landing component image map:', error);
    res.status(500).json({ error: 'Failed to fetch landing component image map' });
  }
});

// POST create section image
router.post('/', requireAdminAuth, async (req, res) => {
  try {
    const payload = normalizeImagePayload(req.body);

    if (!payload.section || !payload.image_key || !payload.image_url) {
      return res.status(400).json({ error: 'section, image_key and image_url are required' });
    }

    const image = await SectionImage.create(payload);
    res.status(201).json(serializeSectionImage(image));
  } catch (error) {
    console.error('Error creating section image:', error);
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'Duplicate section and image_key combination' });
    }
    res.status(500).json({ error: 'Failed to create section image' });
  }
});

// POST upsert image by section + image_key (admin helper endpoint)
router.post('/admin/upsert', requireAdminAuth, async (req, res) => {
  try {
    const payload = normalizeImagePayload(req.body);

    if (!payload.section || !payload.image_key || !payload.image_url) {
      return res.status(400).json({ error: 'section, image_key and image_url are required' });
    }

    const image = await SectionImage.findOneAndUpdate(
      { section: payload.section, image_key: payload.image_key },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    return res.json(serializeSectionImage(image));
  } catch (error) {
    console.error('Error upserting section image:', error);
    return res.status(500).json({ error: 'Failed to upsert section image' });
  }
});

// POST bulk upsert for landing component images
router.post('/admin/bulk-upsert', requireAdminAuth, async (req, res) => {
  try {
    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'images must be a non-empty array' });
    }

    const updatedImages = await Promise.all(images.map(async (entry) => {
      const payload = normalizeImagePayload(entry);
      if (!payload.section || !payload.image_key || !payload.image_url) {
        throw new Error('Each entry requires section, image_key and image_url');
      }

      const doc = await SectionImage.findOneAndUpdate(
        { section: payload.section, image_key: payload.image_key },
        payload,
        { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
      );
      return serializeSectionImage(doc);
    }));

    return res.json({
      message: 'Landing component images updated successfully',
      images: updatedImages
    });
  } catch (error) {
    console.error('Error bulk upserting section images:', error);
    return res.status(500).json({ error: error.message || 'Failed to bulk upsert section images' });
  }
});

// PUT update section image
router.put('/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.order_index !== undefined) {
      updates.order_index = toNumber(updates.order_index, 0);
    }
    if (updates.is_featured !== undefined) {
      updates.is_featured = updates.is_featured === true || updates.is_featured === 'true';
    }

    const image = await SectionImage.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(serializeSectionImage(image));
  } catch (error) {
    console.error('Error updating section image:', error);
    res.status(500).json({ error: 'Failed to update section image' });
  }
});

// DELETE section image (soft delete)
router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const image = await SectionImage.findByIdAndUpdate(id, { is_active: false }, { new: true });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({ message: 'Section image deleted successfully' });
  } catch (error) {
    console.error('Error deleting section image:', error);
    res.status(500).json({ error: 'Failed to delete section image' });
  }
});

// PUT reorder section images
router.put('/section/:section/reorder', requireAdminAuth, async (req, res) => {
  try {
    const { section } = req.params;
    const { imageOrders } = req.body;

    if (!Array.isArray(imageOrders)) {
      return res.status(400).json({ error: 'imageOrders must be an array' });
    }

    await Promise.all(
      imageOrders.map(({ id, order_index }) =>
        SectionImage.findOneAndUpdate(
          { _id: id, section },
          { order_index: toNumber(order_index, 0) },
          { runValidators: true }
        )
      )
    );

    res.json({ message: 'Section images reordered successfully' });
  } catch (error) {
    console.error('Error reordering section images:', error);
    res.status(500).json({ error: 'Failed to reorder section images' });
  }
});

module.exports = router;
