const express = require('express');
const multer = require('multer');
const Image = require('../models/image');
const Project = require('../models/project');
const Stage = require('../models/stage');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  },
});

//POST /api/image/add
//Desc add images to each project

router.post(
  '/add',
  multer({ storage: storage }).single('image'),
  async (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    const { imageName, projectName, stageName } = req.body;
    try {
      //To check whether the imagePath exists
      let image = await Image.findOne({
        imageName,
      });
      if (image) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Image path already exists' }] });
      }
      //Initializing image object
      image = new Image({
        imageName: imageName,
        projectName: projectName,
        stageName: stageName,
        imagePath: url + '/images/' + req.file.filename,
        date: Date.now(),
      });

      await image.save();
      res.status(200).json(image);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//POST /api/image/add/projectName
//Desc Searching projectName

router.post('/add/projectName', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    if (!project) {
      return res.status(400).json({ msg: 'No project found' });
    }
    res.json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/image/add/stageName
//Desc Searching stageName

router.post('/add/stageName', async (req, res) => {
  try {
    const stage = await Stage.findOne({
      stageName: req.body.stageName,
    });
    if (!stage) {
      return res.status(400).json({ msg: 'No stage found' });
    }
    res.json(stage);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/image/get
//Desc View image info
router.get('/get', (req, res) => {
  try {
    Image.find((err, image) => {
      if (err) {
        return res.send(err);
      }
      return res.json(image);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/get/:projectId/:stageId', async (req, res) => {
  try {
    const image = await Image.find({
      stageName: req.params.stageId,
    });
    if (!image) {
      return res.status(404);
    }
    return res.json(image);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:imageId', (req, res, next) => {
  try {
    Image.findById(req.params.imageId, (err, image) => {
      if (err) {
        res.send(err);
      }
      if (image) {
        req.image = image;
        return next();
      }
      return res.sendStatus(404);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/:imageId', (req, res) => {
  try {
    const { image } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      image[key] = value;
    });
    req.image.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(image);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:imageId', (req, res) => {
  try {
    req.image.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
