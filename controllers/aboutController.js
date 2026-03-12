const About = require('../models/About');
const { serializeAbout } = require('../utils/serializers');

// GET about info
const getAbout = async (req, res) => {
  try {
    const about = await About.findOne().sort({ createdAt: -1 });
    
    if (!about) {
      return res.json({
        id: null,
        title: '',
        bio: '',
        photo_url: '',
        created_at: null,
        updated_at: null
      });
    }
    
    res.json(serializeAbout(about));
  } catch (error) {
    console.error('Error fetching about info:', error);
    res.status(500).json({ error: 'Failed to fetch about info' });
  }
};

// PUT update about info
const updateAbout = async (req, res) => {
  try {
    const { title, bio, photo_url } = req.body;

    // Check if about record exists
    let about = await About.findOne().sort({ createdAt: -1 });
    
    const updateData = { title, bio, photo_url };
    
    if (about) {
      // Update existing record
      Object.assign(about, updateData);
      await about.save();
    } else {
      // Create new record
      about = new About(updateData);
      await about.save();
    }

    res.json(serializeAbout(about));
  } catch (error) {
    console.error('Error updating about info:', error);
    res.status(500).json({ error: 'Failed to update about info' });
  }
};

module.exports = {
  getAbout,
  updateAbout
};
