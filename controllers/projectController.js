const Project = require('../models/Project');
const { serializeProject } = require('../utils/serializers');

const VALID_CATEGORIES = new Set([
  'wedding-film',
  'commercial',
  'documentary',
  'music-video',
  'portrait',
  'photography',
  'fashion',
  'event',
  'corporate',
  'creative'
]);

const CATEGORY_ALIASES = {
  wedding: 'wedding-film',
  weddings: 'wedding-film',
  'wedding films': 'wedding-film',
  'wedding film': 'wedding-film',
  'music video': 'music-video',
  'music videos': 'music-video',
  photo: 'photography',
  photos: 'photography',
  photography: 'photography'
};

const asArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const normalizeCategory = (value) => {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return '';

  const mapped = CATEGORY_ALIASES[trimmed]
    || trimmed.replace(/[_\s]+/g, '-').replace(/-+/g, '-');

  return VALID_CATEGORIES.has(mapped) ? mapped : value;
};

const normalizeProjectPayload = (payload = {}) => {
  const videoUrls = asArray(payload.video_urls)
    .map((item, index) => {
      if (typeof item === 'string') {
        return { url: item, is_primary: index === 0 };
      }
      if (item && typeof item === 'object' && item.url) {
        return {
          ...item,
          is_primary: typeof item.is_primary === 'boolean' ? item.is_primary : index === 0
        };
      }
      return null;
    })
    .filter(Boolean);

  const images = asArray(payload.images)
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          url: item,
          title: '',
          alt_text: '',
          caption: '',
          category: 'final-shot',
          is_featured: index === 0,
          order_index: index
        };
      }
      if (item && typeof item === 'object' && item.url) {
        return item;
      }
      return null;
    })
    .filter(Boolean);

  return {
    ...payload,
    category: payload.category !== undefined ? normalizeCategory(payload.category) : payload.category,
    video_urls: videoUrls,
    images,
    featured: payload.featured === true || payload.featured === 'true',
    order_index: Number.isFinite(Number(payload.order_index)) ? Number(payload.order_index) : 0
  };
};

// GET all projects
const getAllProjects = async (req, res) => {
  try {
    const { category, status, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';

    const projects = await Project.find(filter).sort({ order_index: 1, createdAt: -1 });
    res.json(projects.map(serializeProject));
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// GET project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(serializeProject(project));
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// POST new project
const createProject = async (req, res) => {
  try {
    const payload = normalizeProjectPayload(req.body);
    const project = new Project(payload);

    const savedProject = await project.save();
    res.status(201).json(serializeProject(savedProject));
  } catch (error) {
    console.error('Error creating project:', error);
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// PUT update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = normalizeProjectPayload(req.body);

    const project = await Project.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(serializeProject(project));
  } catch (error) {
    console.error('Error updating project:', error);
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// DELETE project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
