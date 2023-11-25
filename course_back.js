const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');


const app = express();
const PORT = 3001;

const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

const Course = sequelize.define('Course', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Enrollment = sequelize.define('Enrollment', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Course.hasMany(Enrollment);
Enrollment.belongsTo(Course);

app.use(bodyParser.json());

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || token !== 'secret_token') {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    next();
  }
};

app.use(authenticate);

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/addEnroll', async (req, res) => {
  const { courseId, studentId } = req.body;
  try {
    const courses = await Course.findByPk(courseId);
    if (!courses) {
      res.status(404).json({ message: 'Invalid course ID' });
      return;
    }

    const enrollment = await Enrollment.create({ studentId });
    await course.addEnrollment(enrollment);

    res.json({ message: 'Enrollment successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/enroll', async (req, res) => {
  const { courseId } = req.body;
  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ message: 'Invalid course ID' });
      return;
    }

    const enrollments = await course.getEnrollments();
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/enroll', async (req, res) => {
  const { courseId, studentId } = req.body;
  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ message: 'Invalid course ID' });
      return;
    }

    const enrollment = await Enrollment.findOne({ where: { studentId } });
    if (!enrollment) {
      res.status(404).json({ message: 'Invalid student ID' });
      return;
    }

    await enrollment.destroy();
    res.json({ message: 'Enrollment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/updateEnroll', async (req, res) => {
  const { courseId, studentId, newCourseId } = req.body;
  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ message: 'Invalid course ID' });
      return;
    }

    const enrollment = await Enrollment.findOne({ where: { studentId } });
    if (!enrollment) {
      res.status(404).json({ message: 'Invalid student ID' });
      return;
    }

    const newCourse = await Course.findByPk(newCourseId);
    if (!newCourse) {
      res.status(404).json({ message: 'Invalid new course ID' });
      return;
    }

    await enrollment.update({ courseId: newCourseId });
    res.json({ message: 'Enrollment updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
