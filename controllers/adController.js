const Ad = require('../models/Ad');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

const getAds = async (req, res) => {
  const { keyword, category } = req.query;
  const query = {};

  if (keyword) {
    query.title = {
      $regex: keyword,
      $options: 'i',
    };
  }

  if (category) {
    query.category = category;
  }

  try {
    const ads = await Ad.find(query).populate('category').populate('seller', 'name email avatar');
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('category').populate('seller', 'name email avatar');
    if (ad) {
      ad.views += 1;
      await ad.save();
      res.json(ad);
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createAd = async (req, res) => {
  const { title, description, price, category, condition, location, college } = req.body;
  const images = req.files.map(file => file.path);

  const ad = new Ad({
    title,
    description,
    price,
    category,
    condition,
    images,
    seller: req.user._id,
    location,
    college,
  });

  try {
    const createdAd = await ad.save();
    res.status(201).json(createdAd);
  } catch (error) {
    res.status(400).json({ message: 'Invalid ad data' });
  }
};

const updateAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (ad) {
            if (req.body.$inc && req.body.$inc.views) {
                ad.views = (ad.views || 0) + req.body.$inc.views;
                const updatedAd = await ad.save();
                res.json(updatedAd);
                return;
            }

            if (ad.seller.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }

            const { title, description, price, category, condition, location, college, status } = req.body;
            ad.title = title || ad.title;
            ad.description = description || ad.description;
            ad.price = price || ad.price;
            ad.category = category || ad.category;
            ad.condition = condition || ad.condition;
            ad.location = location || ad.location;
            ad.college = college || ad.college;
            ad.status = status || ad.status;

            const updatedAd = await ad.save();
            res.json(updatedAd);
        } else {
            res.status(404).json({ message: 'Ad not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid ad data' });
    }
};

const deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (ad) {
            if (ad.seller.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }

            // Delete images from Cloudinary
            if (ad.images && ad.images.length > 0) {
                console.log('Attempting to delete images:', ad.images);
                
                const publicIds = ad.images
                    .map(url => {
                        // Extract public ID with folder - improved regex
                        const match = url.match(/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
                        const publicId = match ? match[1] : null;
                        console.log('URL:', url, 'Extracted public ID:', publicId);
                        return publicId;
                    })
                    .filter(Boolean);

                console.log('Public IDs to delete:', publicIds);

                if (publicIds.length > 0) {
                    try {
                        const result = await cloudinary.api.delete_resources(publicIds);
                        console.log('Cloudinary deletion result:', result);
                    } catch (cloudErr) {
                        console.error('Cloudinary deletion error:', cloudErr);
                        // Continue with ad deletion even if image deletion fails
                    }
                }
            }
            
            await ad.deleteOne({_id: req.params.id});
            res.json({ message: 'Ad removed' });
        } else {
            res.status(404).json({ message: 'Ad not found' });
        }
    } catch (error) {
        console.error('Delete ad error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAdsByUser = async (req, res) => {
    try {
        const ads = await Ad.find({ seller: req.params.userId }).populate('category').populate('seller', 'name email avatar');
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
  getAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  getAdsByUser,
};