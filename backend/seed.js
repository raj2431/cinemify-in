require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Genre, Content, Episode } = require('./models');

const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const SAMPLE_VIDEO_2 = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

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
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
    console.log(`Created admin user: ${adminEmail} / admin123`);
  }

  const movies = [
    {
      title: 'Neon Skyline', description: 'A detective chases a data thief through a rain-soaked megacity.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/neon/400/600', bannerUrl: 'https://picsum.photos/seed/neonbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2023, durationMinutes: 118, rating: 8.2, featured: true,
      genreNames: ['Action', 'Thriller'],
    },
    {
      title: 'Quiet Harbor', description: 'Two estranged sisters reunite after their father\'s passing.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/harbor/400/600', bannerUrl: 'https://picsum.photos/seed/harborbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2022, durationMinutes: 104, rating: 7.6, featured: false,
      genreNames: ['Drama'],
    },
    {
      title: 'Laugh Track', description: 'A washed-up comedian gets one last shot at a comeback special.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/laugh/400/600', bannerUrl: 'https://picsum.photos/seed/laughbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2021, durationMinutes: 96, rating: 6.9, featured: false,
      genreNames: ['Comedy'],
    },
    {
      title: 'Event Horizon Nine', description: 'A colony ship crew discovers they are not alone at the edge of the galaxy.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/horizon/400/600', bannerUrl: 'https://picsum.photos/seed/horizonbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2024, durationMinutes: 132, rating: 8.7, featured: true,
      genreNames: ['Sci-Fi', 'Thriller'],
    },
    {
      title: 'Monsoon Wedding Blues', description: 'A chaotic family reunion unravels old rivalries just days before a wedding.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/monsoon/400/600', bannerUrl: 'https://picsum.photos/seed/monsoonbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2022, durationMinutes: 141, rating: 7.4, featured: false,
      genreNames: ['Comedy', 'Romance'],
    },
    {
      title: 'Iron Circuit', description: 'An underground street racer is recruited into a heist crew targeting a crypto exchange.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/iron/400/600', bannerUrl: 'https://picsum.photos/seed/ironbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2023, durationMinutes: 112, rating: 7.1, featured: false,
      genreNames: ['Action'],
    },
    {
      title: 'The Last Lighthouse', description: 'A lightkeeper on a remote island uncovers a decades-old conspiracy.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/lighthouse/400/600', bannerUrl: 'https://picsum.photos/seed/lighthousebanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2020, durationMinutes: 108, rating: 7.8, featured: false,
      genreNames: ['Thriller', 'Drama'],
    },
    {
      title: 'Second Innings', description: 'A retired cricket coach takes on a struggling village team for one last shot at glory.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/innings/400/600', bannerUrl: 'https://picsum.photos/seed/inningsbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2021, durationMinutes: 126, rating: 8.0, featured: true,
      genreNames: ['Drama'],
    },
    {
      title: 'Ghost Frequency', description: 'A radio host starts receiving broadcasts from a station that burned down years ago.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/ghostfreq/400/600', bannerUrl: 'https://picsum.photos/seed/ghostfreqbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2023, durationMinutes: 99, rating: 6.8, featured: false,
      genreNames: ['Thriller'],
    },
    {
      title: 'Paper Hearts', description: 'Two rival greeting-card writers fall for each other while ghostwriting the same wedding speech.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/paperhearts/400/600', bannerUrl: 'https://picsum.photos/seed/paperheartsbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2022, durationMinutes: 101, rating: 7.0, featured: false,
      genreNames: ['Romance', 'Comedy'],
    },
    {
      title: 'Deep Current', description: 'A marine biologist and a salvage diver race a mining corporation to a reef full of secrets.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/deepcurrent/400/600', bannerUrl: 'https://picsum.photos/seed/deepcurrentbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2024, durationMinutes: 116, rating: 7.5, featured: false,
      genreNames: ['Action', 'Sci-Fi'],
    },
    {
      title: 'The Spice Merchants', description: 'A documentary tracing three generations of a family-run spice trading house.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/spice/400/600', bannerUrl: 'https://picsum.photos/seed/spicebanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2021, durationMinutes: 88, rating: 8.3, featured: false,
      genreNames: ['Documentary'],
    },
    {
      title: 'Nightshift Diner', description: 'Strangers passing through an all-night diner discover their lives are more connected than they thought.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/diner/400/600', bannerUrl: 'https://picsum.photos/seed/dinerbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2020, durationMinutes: 97, rating: 7.2, featured: false,
      genreNames: ['Drama', 'Comedy'],
    },
    {
      title: 'Crimson Peaks', description: 'A mountaineering expedition goes wrong when the team realizes they are being hunted.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/crimson/400/600', bannerUrl: 'https://picsum.photos/seed/crimsonbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2023, durationMinutes: 121, rating: 7.6, featured: false,
      genreNames: ['Thriller', 'Action'],
    },
    {
      title: 'Bombay Static', description: 'A pirate radio DJ becomes the unlikely voice of a city-wide protest movement.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/bombaystatic/400/600', bannerUrl: 'https://picsum.photos/seed/bombaystaticbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2022, durationMinutes: 132, rating: 8.5, featured: true,
      genreNames: ['Drama'],
    },
    {
      title: 'The Wedding Heist', description: 'A groom\'s estranged brother returns to pull off one last con at the reception.',
      type: 'movie', posterUrl: 'https://picsum.photos/seed/weddingheist/400/600', bannerUrl: 'https://picsum.photos/seed/weddingheistbanner/1280/720',
      videoUrl: SAMPLE_VIDEO, trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2024, durationMinutes: 109, rating: 6.9, featured: false,
      genreNames: ['Comedy', 'Action'],
    },
  ];

  const series = [
    {
      title: 'Wire Crossed', description: 'Rival hackers are forced to team up to stop a rogue AI.',
      type: 'series', posterUrl: 'https://picsum.photos/seed/wire/400/600', bannerUrl: 'https://picsum.photos/seed/wirebanner/1280/720',
      trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2023, rating: 8.0, featured: true,
      genreNames: ['Sci-Fi', 'Drama'],
      episodes: [
        { season: 1, episodeNumber: 1, title: 'Pilot', videoUrl: SAMPLE_VIDEO, durationMinutes: 45 },
        { season: 1, episodeNumber: 2, title: 'Backdoor', videoUrl: SAMPLE_VIDEO, durationMinutes: 42 },
        { season: 1, episodeNumber: 3, title: 'Firewall', videoUrl: SAMPLE_VIDEO, durationMinutes: 47 },
      ],
    },
    {
      title: 'Dynasty Kitchens', description: 'Three rival restaurant families battle for a Michelin star and each other\'s secrets.',
      type: 'series', posterUrl: 'https://picsum.photos/seed/dynasty/400/600', bannerUrl: 'https://picsum.photos/seed/dynastybanner/1280/720',
      trailerUrl: SAMPLE_VIDEO_2, releaseYear: 2024, rating: 7.9, featured: false,
      genreNames: ['Drama', 'Comedy'],
      episodes: [
        { season: 1, episodeNumber: 1, title: 'Mise en Place', videoUrl: SAMPLE_VIDEO, durationMinutes: 38 },
        { season: 1, episodeNumber: 2, title: 'Service', videoUrl: SAMPLE_VIDEO, durationMinutes: 41 },
        { season: 1, episodeNumber: 3, title: 'The Tasting', videoUrl: SAMPLE_VIDEO, durationMinutes: 39 },
        { season: 1, episodeNumber: 4, title: 'Send It Back', videoUrl: SAMPLE_VIDEO, durationMinutes: 43 },
      ],
    },
  ];

  for (const m of movies) {
    const { genreNames: gNames, ...data } = m;
    const [content] = await Content.findOrCreate({ where: { title: m.title }, defaults: data });
    await content.setGenres(gNames.map((n) => genres[n].id));
  }

  for (const s of series) {
    const { genreNames: gNames, episodes, ...data } = s;
    const [content] = await Content.findOrCreate({ where: { title: s.title }, defaults: data });
    await content.setGenres(gNames.map((n) => genres[n].id));
    for (const ep of episodes) {
      await Episode.findOrCreate({ where: { contentId: content.id, season: ep.season, episodeNumber: ep.episodeNumber }, defaults: { ...ep, contentId: content.id } });
    }
  }

  console.log('Seed complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
