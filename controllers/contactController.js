const ContactSubmission = require('../models/ContactSubmission');
const { serializeContactSubmission } = require('../utils/serializers');

// GET all contact submissions
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json(submissions.map(serializeContactSubmission));
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
};

// GET contact submission by ID
const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await ContactSubmission.findById(id);
    
    if (!submission) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.json(serializeContactSubmission(submission));
  } catch (error) {
    console.error('Error fetching contact submission:', error);
    res.status(500).json({ error: 'Failed to fetch contact submission' });
  }
};

// POST new contact submission
const createSubmission = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      project_type
    } = req.body;

    const submission = new ContactSubmission({
      name,
      email,
      phone,
      message,
      project_type
    });

    const savedSubmission = await submission.save();
    res.status(201).json(serializeContactSubmission(savedSubmission));
  } catch (error) {
    console.error('Error creating contact submission:', error);
    res.status(500).json({ error: 'Failed to create contact submission' });
  }
};

// PUT update submission status
const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    res.json(serializeContactSubmission(submission));
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ error: 'Failed to update submission status' });
  }
};

// DELETE contact submission
const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await ContactSubmission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    res.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    res.status(500).json({ error: 'Failed to delete contact submission' });
  }
};

module.exports = {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmissionStatus,
  deleteSubmission
};
