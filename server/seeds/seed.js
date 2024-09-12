const db = require('../config/connection');
const { User, FavoriteBook } = require('../models');
const userSeeds = require('./userSeeds.json');
const favoriteBookSeeds = require('./favoriteBookSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    await cleanDB('FavoriteBook', 'favoriteBooks');

    await cleanDB('User', 'users');

    // await User.create(userSeeds);

    // for (let i = 0; i < favoriteBookSeeds.length; i++) {
    //   const { _id, favoredBy } = await FavoriteBook.create(favoriteBookSeeds[i]);
    //   const user = await User.findOneAndUpdate(
    //     { username: favoredBy },
    //     {
    //       $addToSet: {
    //         favoriteBooks: _id,
    //       },
    //     }
    //   );
    // }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
