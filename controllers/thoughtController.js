const { User, Thought } = require("../models");

module.exports = {
    async getThoughts (req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err)
        }
    },

    async getSingleThought (req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })

            if (!thought) {
                return res.status(404).json({ message: "No thought found!" })
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought (req, res) {
        try {
            const newThought = Thought.create(req.body)

            const assignThought = User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: newThought._id } },
                { runValidators: true, new: true }
            )

           res.json(newThought, assignThought)
        } catch (err) {
            res.status(500).json(err)
        }
    },

    async updateThought (req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            )

            if (!thought) {
                res.status(404).json({ message: "No matching thought found!" })
            }

            res.json(thought)
        } catch (err) {
            res.status(500).json(err)
        }
        
    },

    async deleteThought (req, res) {
        try {
            const delThought = await Thought.findOneAndDelete({ _id: req.params.ThoughtId })

            if (!delThought) {
                res.status(404).json({ message: "No matching thought found!" })
            }

            res.json(delThought);
        } catch (err) {
            res.status(500).json(err)
        }
    },

    async createReaction (req, res) {
        try {
            const newReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            )

            if (!newReaction) {
                res.status(404).json({ message: "No matching thought found!" })
            }

            res.json(newReaction)
        } catch (err) {
            res.status(500)
        }
    },

    async deleteReaction (req, res) {
        try {
            const delReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { _id: req.params.reactionId } } },
                { runValidators: true, new: true }
            )

            if (!delReaction) {
                res.status(404).json({ message: "No matching thought found!" })
            }

            res.json(delReaction)
        } catch (err) {
            res.status(500).json(err)
        }
    }
}