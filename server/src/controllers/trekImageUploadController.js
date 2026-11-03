export function uploadTrekImages(req, res) {
  if (!req.files?.length) {
    return res.status(400).json({ success: false, message: "Choose at least one image to upload." });
  }

  const uploadedImages = (req.files || []).map((file) => ({
    url: `/api/uploads/treks/${file.filename}`,
    name: file.originalname,
    size: file.size,
  }));

  return res.status(201).json({ success: true, images: uploadedImages });
}
