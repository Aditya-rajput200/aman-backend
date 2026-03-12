const toPlainObject = (doc) => {
  if (!doc) return null;
  return typeof doc.toObject === 'function' ? doc.toObject() : doc;
};

const withCommonFields = (doc) => {
  const plain = toPlainObject(doc);
  if (!plain) return null;

  const { _id, __v, createdAt, updatedAt, ...rest } = plain;

  return {
    ...rest,
    id: _id ? String(_id) : undefined,
    created_at: createdAt || null,
    updated_at: updatedAt || null
  };
};

const serializeProject = (doc) => {
  const base = withCommonFields(doc);
  if (!base) return null;

  return {
    ...base,
    video_urls: (base.video_urls || [])
      .map((item) => (typeof item === 'string' ? item : item?.url))
      .filter(Boolean),
    images: (base.images || [])
      .map((item) => (typeof item === 'string' ? item : item?.url))
      .filter(Boolean)
  };
};

const serializeService = (doc) => withCommonFields(doc);
const serializeAbout = (doc) => withCommonFields(doc);
const serializeContactSubmission = (doc) => withCommonFields(doc);
const serializeSectionImage = (doc) => withCommonFields(doc);

module.exports = {
  serializeProject,
  serializeService,
  serializeAbout,
  serializeContactSubmission,
  serializeSectionImage
};
