module.exports = function (app) {

  app.post('/api/course/:courseId/section', createSection);
  app.get('/api/course/:courseId/section', findSectionsForCourse);
  app.post('/api/section/:sectionId/enrollment', enrollStudentInSection);
  app.get('/api/student/section', findSectionsForStudent);
  app.delete('/api/section/:sectionId', deleteSection);
  app.put('/api/section/:sectionId', updateSection);
  app.delete('/api/section/:sectionId/enrollment', unrollStudentInSection);


  var sectionModel = require('../models/section/section.model.server');
  var enrollmentModel = require('../models/enrollment/enrollment.model.server');

  function findSectionsForStudent(req, res) {
    var currentUser = req.session.currentUser;
    var studentId = currentUser._id;
    enrollmentModel
      .findSectionsForStudent(studentId)
      .then(function(enrollments) {
        res.json(enrollments);
      });
  }


  function unrollStudentInSection(req, res) {
    var sectionId = req.params.sectionId;
    var currentUser = req.session.currentUser;
    var studentId = currentUser._id;
    var enrollment = {
      student: studentId,
      section: sectionId
    };

    sectionModel
      .incrementSectionSeats(sectionId)
      .then(function () {
        return enrollmentModel
          .unrollStudentInSection(enrollment)
      })
      .then(function (enrollment) {
        res.json(enrollment);
      })
  }

  function enrollStudentInSection(req, res) {
    var sectionId = req.params.sectionId;
    var currentUser = req.session.currentUser;
    var studentId = currentUser._id;
    var enrollment = {
      student: studentId,
      section: sectionId
    };

    sectionModel
      .decrementSectionSeats(sectionId)
      .then(function () {
        return enrollmentModel
          .enrollStudentInSection(enrollment)
      })
      .then(function (enrollment) {
        res.json(enrollment);
      })
  }

  function deleteSection(req, res) {
    var sectionId = req.params['sectionId'];
    sectionModel
      .deleteSection(sectionId)
      .then(function (sections) {
        res.json(sections);
      })
  }
  function findSectionsForCourse(req, res) {
    var courseId = req.params['courseId'];
    sectionModel
      .findSectionsForCourse(courseId)
      .then(function (sections) {
        res.json(sections);
      })
  }

  function updateSection(req, res) {
    var section = req.body;
    sectionModel
      .updateSection(section)
      .then(function (section) {
        res.json(section);
      })
  }

  function createSection(req, res) {
    var section = req.body;
    sectionModel
      .createSection(section)
      .then(function (section) {
        res.json(section);
      })
  }
};
