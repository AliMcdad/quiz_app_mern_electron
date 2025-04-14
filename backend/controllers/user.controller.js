const Player = require('../models/playerModel'); // Adjust the path if needed

exports.createPlayer = async (req, res) => {
  try {
    const { name, score } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    const newPlayer = new Player({
      name,
      score: score || 0 // use provided score or default to 0
    });

    await newPlayer.save();

    res.status(201).json({ message: 'Player created successfully!', player: newPlayer });
  } catch (err) {
    console.error('Error creating player:', err.message);
    res.status(500).json({ message: 'Server error creating player.' });
  }
};


exports.getPlayer = async (req, res) => {
    try {
      const { id } = req.params;
      const player = await Player.findById(id);
      if (!player) return res.status(404).json({ message: "Player not found." });
  
      res.status(200).json({ player });
    } catch (err) {
      res.status(500).json({ message: "Server error getting player." });
    }
  };
  