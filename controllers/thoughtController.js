const { ObjectId } = require('mongoose').Types;
const { User, Thought, reactionSchema } = require('../models');

// // Aggregate function to get the number of students overall
// const headCount = async () =>
//   Student.aggregate()
//     .count('studentCount')
//     .then((numberOfStudents) => numberOfStudents);

// // Aggregate function for getting the overall grade using $avg
// const grade = async (studentId) =>
//   Student.aggregate([
//     // only include the given student by using $match
//     { $match: { _id: ObjectId(studentId) } },
//     {
//       $unwind: '$assignments',
//     },
//     {
//       $group: {
//         _id: ObjectId(studentId),
//         overallGrade: { $avg: '$assignments.score' },
//       },
//     },
//   ]);

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate({path: 'reactions', select: ('-__v')})
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No such thought exists' })
          : User.findOneAndUpdate(
              { username: thought.username },
              { $push: { thoughts: thought._id } },
              { new: true }
            )
      )
      .then(() => res.status(200).json('Thought created'))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a student and remove them from the course
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No such thought exists' })
          : User.findOneAndUpdate(
              { username: thought.username },
              { $pull: { thoughts: thought._id } },
              { new: true }
            )
      )
      .then(() => res.status(200).json('Thought deleted'))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add a reaction to a thought
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove reaction from a thought
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.body.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
