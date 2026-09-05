require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Genre, Content, Profile } = require('./models');

const run = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const genreNames = ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Thriller', 'Romance', 'Documentary'];
  const genres = {};
  for (const name of genreNames) {
    const [genre] = await Genre.findOrCreate({ where: { name } });
    genres[name] = genre;
  }

  const adminEmail = 'admin@cinemify.com';
  let admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    admin = await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
    console.log(`Created admin user: ${adminEmail} / admin123`);
  }
  await Profile.findOrCreate({ where: { userId: admin.id }, defaults: { name: 'Admin', avatarColor: '#e50914' } });

  // Real, freely-licensed short films (Blender Foundation open movies, CC BY 3.0/4.0),
  // hosted on the Internet Archive. Posters are official promotional art from Wikimedia Commons.
  const movies = [
    {
      title: 'Big Buck Bunny',
      description: "A giant, easygoing rabbit is bullied by three mischievous rodents, until he decides enough is enough. The Blender Foundation's landmark 2008 open-source animated short.",
      type: 'movie',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg',
      bannerUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg',
      videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
      trailerUrl: null,
      releaseYear: 2008, durationMinutes: 10, rating: 8.6, featured: true,
      genreNames: ['Comedy'],
    },
    {
      title: "Elephants Dream",
      description: 'Two characters, Proog and Emo, explore a strange machine world in this surreal 2006 short — the very first film ever made entirely with open-source software.',
      type: 'movie',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/ElephantsDreamPoster.jpg',
      bannerUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/ElephantsDreamPoster.jpg',
      videoUrl: 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
      trailerUrl: null,
      releaseYear: 2006, durationMinutes: 11, rating: 7.9, featured: false,
      genreNames: ['Sci-Fi', 'Drama'],
    },
    {
      title: 'Sintel',
      description: 'A lonely girl named Sintel searches a vast, dragon-inhabited world for a baby dragon she raised and lost. A 2010 fantasy adventure from the Blender Foundation.',
      type: 'movie',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg',
      bannerUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg',
      videoUrl: 'https://archive.org/download/Sintel/sintel-2048-surround_512kb.mp4',
      trailerUrl: null,
      releaseYear: 2010, durationMinutes: 15, rating: 8.8, featured: true,
      genreNames: ['Action', 'Drama'],
    },
    {
      title: 'Tears of Steel',
      description: 'In a ravaged future Amsterdam, a group of warriors and scientists gather at the Oude Kerk to stage a risky plan against an army of robots. A 2012 sci-fi short blending live action and CGI.',
      type: 'movie',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Tos-poster.png',
      bannerUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Tos-poster.png',
      videoUrl: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
      trailerUrl: null,
      releaseYear: 2012, durationMinutes: 12, rating: 7.5, featured: false,
      genreNames: ['Sci-Fi', 'Action'],
    },
    {
      title: 'Cosmos Laundromat: First Cycle',
      description: 'A suicidal, wealthy sheep named Franck is given one more chance at life by a mysterious salesman. A surreal 2015 comedy-drama from the Blender Foundation.',
      type: 'movie',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/CosmosLaundromatPoster.jpg',
      bannerUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/CosmosLaundromatPoster.jpg',
      videoUrl: 'https://archive.org/download/cosmos-laundromat-first-cycle/Cosmos%20Laundromat%20-%20First%20Cycle.mp4',
      trailerUrl: null,
      releaseYear: 2015, durationMinutes: 12, rating: 7.3, featured: false,
      genreNames: ['Comedy', 'Drama'],
    },
    {
      title: 'Agent 327: Operation Barbershop',
      description: 'Dutch secret agent Agent 327 walks into a barbershop that is not what it seems, in this fast, action-comedy short released by Blender Studio in 2017.',
      type: 'movie',
      posterUrl: 'https://archive.org/services/img/agent327operationbarbershop',
      bannerUrl: 'https://archive.org/services/img/agent327operationbarbershop',
      videoUrl: 'https://archive.org/download/agent327operationbarbershop/agent327.mp4',
      trailerUrl: null,
      releaseYear: 2017, durationMinutes: 4, rating: 7.7, featured: false,
      genreNames: ['Action', 'Comedy'],
    },
    {
      title: 'Spring',
      description: 'A shepherd and her flock encounter a spirit who guards the change of seasons, in this 2019 fantasy short showcasing Blender\'s real-time EEVEE renderer.',
      type: 'movie',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Spring2019AlphaPosterBlender.jpg',
      bannerUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Spring2019AlphaPosterBlender.jpg',
      videoUrl: 'https://archive.org/download/spring_blenderopenmovie/Spring%20-%20Blender%20Open%20Movie%20-%20YouTube.mp4',
      trailerUrl: null,
      releaseYear: 2019, durationMinutes: 7, rating: 7.8, featured: true,
      genreNames: ['Drama'],
    },
  ];

  for (const m of movies) {
    const { genreNames: gNames, ...data } = m;
    const [content, created] = await Content.findOrCreate({ where: { title: m.title }, defaults: data });
    if (!created) {
      await content.update(data);
    }
    await content.setGenres(gNames.map((n) => genres[n].id));
  }

  console.log('Seed complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
