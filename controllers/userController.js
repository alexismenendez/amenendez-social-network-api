const { User, Thought } = require("../models");

module.exports = {
    async getUsers(req, res) {
        try {
            const user = await User.find().populate("thoughts");
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleUser (req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
            .populate("thoughts").populate("friends")

            if (!user) {
                return res.status(404).json({ message: "No matching user found"})
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createUser (req, res) {
        try {
            const newUser = await User.create(req.body)
            res.json(newUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateUser (req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            )

            if (!user) {
                res.status(404).json({ message: 'No matching user found!' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteUser (req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId })
            if (!user) {
                res.status(404).json({ message: 'No matching user found!' });
            }

            await Thought.deleteMany({ _id: { $in: user.thoughts } })
            res.json({ message: "User and user's thoughts deleted!" })
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addFriend (req, res) {
        try {
            const newFriend = await User.findOneAndUpdate(
              { _id: req.params.userId },
              { $addToSet: { friends: req.body } },
              { runValidators: true, new: true }
            );
      
            if (!newFriend) {
                res.status(404).json({ message: 'No matching user found!' });
            }
      
            res.json(newFriend);
          } catch (err) {
            res.status(500).json(err);
          }
    },

    async deleteFriend (req, res) {
        try {
            const delFriend = await User.findOneAndUpdate(
              { _id: req.params.userId },
              { $pull: { friends: { friendId: req.params.friendId }} },
              { runValidators: true, new: true }
            );
      
            if (!delFriend) {
                res.status(404).json({ message: 'No matching user found!' });
            }
      
            res.json(delFriend);
          } catch (err) {
            res.status(500).json(err);
          }
    }
}