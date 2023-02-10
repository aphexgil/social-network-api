const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { usernames, emails, texts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing user
  await User.deleteMany({});

  // Drop existing thoughts
  await Thought.deleteMany({});

  // Create empty array to hold the user
  const users = [];
  const thoughts = [];

  // Loop 20 times -- add users to the users array
  for (let i = 0; i < 80; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data

    thoughts.push({
      username: usernames[i],
      thoughtText: texts[i]
    })

    users.push({
      username: usernames[i],
      email: emails[i]
    });
  }

  // Add user to the collection and await the results
  await User.collection.insertMany(users);

  // Add courses to the collection and await the results
  //await Thought.collection.insertMany(thoughts);

  // Log out the seed data to indicate what should appear in the database
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
