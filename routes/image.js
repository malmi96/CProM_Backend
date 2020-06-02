const express = require('express');

const Image = require('../models/image');
const Project = require('../models/project');
const Stage = require('../models/stage');

const router = express.Router();

//POST /api/image/add
//Desc add images to each project

router.post('/add', async (req, res) => {
  const { imagePath, projectName, stageName, Date } = req.body;
  try {
    //To check whether the imagePath exists
    let image = await image.findOne({
      imagePath,
    });
    if (image) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Image path already exists' }] });
    }
    //Initializing image object
    image = new Image({
      imagePath,
      projectName,
      stageName,
      Date,
    });

    await image.save();
    res.status(200).json(image);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

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
