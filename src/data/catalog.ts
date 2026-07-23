import { MediaItem } from '../types';

export const INITIAL_CATALOG: MediaItem[] = [
  // --- FILMS ---
  {
    id: 'movie-1',
    title: 'Dune : Deuxième Partie',
    originalTitle: 'Dune: Part Two',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    overview: 'Paul Atréides s’unit à Chani et aux Fremen pour mener la révolte contre ceux qui ont détruit sa famille. Face à un choix entre l’amour de sa vie et le destin de l’univers, il tente d’empêcher un futur terrible que lui seul peut prédire.',
    genres: ['Science-Fiction', 'Aventure', 'Action'],
    releaseYear: 2024,
    rating: 8.6,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    runtime: 166,
    moods: ['Épique', 'Sombre', 'Visuellement Sublimé', 'Cérébral & Science-Fiction'],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    addedBy: 'system'
  },
  {
    id: 'movie-2',
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
    overview: 'Biopic captivant sur J. Robert Oppenheimer, le physicien américain qui a dirigé le Projet Manhattan durant la Seconde Guerre mondiale pour concevoir la première bombe atomique.',
    genres: ['Histoire', 'Drame', 'Biopic'],
    releaseYear: 2023,
    rating: 8.9,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
    runtime: 180,
    moods: ['Intense', 'Captivant', 'Historique', 'Cérébral & Science-Fiction'],
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    addedBy: 'system'
  },
  {
    id: 'movie-3',
    title: 'Inception',
    originalTitle: 'Inception',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    overview: 'Dom Cobb est un voleur expérimenté dans l\'art périlleux de l\'extraction : il vole les secrets les plus intimes logés dans le subconscient durant le sommeil.',
    genres: ['Science-Fiction', 'Action', 'Thriller'],
    releaseYear: 2010,
    rating: 8.8,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy', 'Marion Cotillard'],
    runtime: 148,
    moods: ['Cérébral & Science-Fiction', 'Inspirant & Réconfortant', 'Effrayant & Suspense'],
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
    addedBy: 'system'
  },
  {
    id: 'movie-4',
    title: 'Interstellar',
    originalTitle: 'Interstellar',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    overview: 'Alors que la Terre se meurt, une équipe d’explorateurs franchit un trou de ver nouvellement découvert afin de trouver une nouvelle planète habitable pour l’humanité.',
    genres: ['Science-Fiction', 'Aventure', 'Drame'],
    releaseYear: 2014,
    rating: 8.7,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    runtime: 169,
    moods: ['Émotionnel', 'Épique', 'Cérébral & Science-Fiction'],
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    addedBy: 'system'
  },
  {
    id: 'movie-5',
    title: 'Le Voyage de Chihiro',
    originalTitle: 'Spirited Away',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1600&auto=format&fit=crop',
    overview: 'Chihiro, une fillette de 10 ans, s’engage avec ses parents dans un mystérieux tunnel. De l’autre côté se dresse une ville fantôme où ses parents se changent en cochons.',
    genres: ['Animation', 'Fantastique', 'Aventure'],
    releaseYear: 2001,
    rating: 8.6,
    director: 'Hayao Miyazaki',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
    runtime: 125,
    moods: ['Inspirant & Réconfortant', 'Poétique', 'Familial'],
    trailerUrl: 'https://www.youtube.com/embed/ByXuk9QqQkk',
    addedBy: 'system'
  },
  {
    id: 'movie-6',
    title: 'Parasite',
    originalTitle: 'Gisaengchung',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    overview: 'Toute la famille de Ki-taek est au chômage et s’intéresse fortement au train de vie de la riche famille Park. Un jour, le fils réussit à se faire recommander pour donner des cours particuliers d’anglais chez les Park.',
    genres: ['Thriller', 'Comédie Noire', 'Drame'],
    releaseYear: 2019,
    rating: 8.5,
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    runtime: 132,
    moods: ['Effrayant & Suspense', 'Soirée pop-corn', 'Choc'],
    addedBy: 'system'
  },
  {
    id: 'movie-7',
    title: 'The Dark Knight',
    originalTitle: 'The Dark Knight',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop',
    overview: 'Batman s’associe au lieutenant Jim Gordon et au procureur Harvey Dent pour démanteler les dernières organisations criminelles de Gotham City. L’alliance s’avère efficace, jusqu’à l’apparition du Joker.',
    genres: ['Action', 'Crime', 'Drame'],
    releaseYear: 2008,
    rating: 9.0,
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Gary Oldman', 'Morgan Freeman'],
    runtime: 152,
    moods: ['Intense', 'Sombre', 'Effrayant & Suspense'],
    addedBy: 'system'
  },
  {
    id: 'movie-8',
    title: ' Spider-Man: Across the Spider-Verse',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop',
    overview: 'Miles Morales est catapulté à travers le Multivers, où il rencontre une équipe de Spider-Héros chargée de protéger son existence même. Mais lorsque les héros s’opposent sur la façon de gérer une nouvelle menace, Miles doit redéfinir ce que signifie être un héros.',
    genres: ['Animation', 'Action', 'Aventure'],
    releaseYear: 2023,
    rating: 8.7,
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    runtime: 140,
    moods: ['Visuellement Sublimé', 'Inspirant & Réconfortant', 'Soirée pop-corn'],
    addedBy: 'system'
  },

  // --- SÉRIES ---
  {
    id: 'series-1',
    title: 'Breaking Bad',
    originalTitle: 'Breaking Bad',
    type: 'series',
    poster: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    overview: 'Un professeur de chimie de lycée atteint d’un cancer du poumon inopérable se tourne vers la fabrication et la vente de méthamphétamine avec un ancien élève pour assurer l’avenir financier de sa famille.',
    genres: ['Drame', 'Crime', 'Thriller'],
    releaseYear: 2008,
    rating: 9.5,
    creator: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn', 'Dean Norris', 'Giancarlo Esposito'],
    totalSeasons: 5,
    totalEpisodes: 62,
    moods: ['Intense', 'Sombre', 'Effrayant & Suspense', 'Addictif'],
    addedBy: 'system',
    seasonsData: [
      {
        seasonNumber: 1,
        name: 'Saison 1',
        episodeCount: 7,
        episodes: [
          { episodeNumber: 1, title: 'Pilote', durationMinutes: 58, overview: 'Walter White apprend une terrible nouvelle et prend une décision radicale.' },
          { episodeNumber: 2, title: 'Le Choix', durationMinutes: 48, overview: 'Walter et Jesse doivent éliminer les preuves de leur première livraison.' },
          { episodeNumber: 3, title: 'Défaire les liens', durationMinutes: 48, overview: 'Walter fait face à un dilemme moral concernant Krazy-8.' },
          { episodeNumber: 4, title: 'Retour aux sources', durationMinutes: 47, overview: 'La famille de Walter découvre sa maladie.' },
          { episodeNumber: 5, title: 'Vivre ou survivre', durationMinutes: 48, overview: 'Walter refuse l’aide financière d’Elliott Schwart.' },
          { episodeNumber: 6, title: 'Bluff d’enfer', durationMinutes: 48, overview: 'Walter prend le pseudonyme d’Heisenberg pour traiter avec Tuco.' },
          { episodeNumber: 7, title: 'Le Fruit défendu', durationMinutes: 48, overview: 'Walter et Jesse préparent un gros coup d’alchimie.' }
        ]
      },
      {
        seasonNumber: 2,
        name: 'Saison 2',
        episodeCount: 13,
        episodes: [
          { episodeNumber: 1, title: 'Le Traqueur', durationMinutes: 47 },
          { episodeNumber: 2, title: 'Chasse à l’homme', durationMinutes: 47 },
          { episodeNumber: 3, title: 'Alibi', durationMinutes: 47 },
          { episodeNumber: 4, title: 'Au fond du gouffre', durationMinutes: 47 },
          { episodeNumber: 5, title: 'Nouveau départ', durationMinutes: 47 },
          { episodeNumber: 6, title: 'Règlement de comptes', durationMinutes: 47 },
          { episodeNumber: 7, title: 'Negro y Azul', durationMinutes: 47 },
          { episodeNumber: 8, title: 'Appelez Saul !', durationMinutes: 47 },
          { episodeNumber: 9, title: 'Seuls au monde', durationMinutes: 47 },
          { episodeNumber: 10, title: 'Aimer, honorer, obéir', durationMinutes: 47 },
          { episodeNumber: 11, title: 'Mandala', durationMinutes: 47 },
          { episodeNumber: 12, title: 'Vie et mort', durationMinutes: 47 },
          { episodeNumber: 13, title: 'ABQ', durationMinutes: 47 }
        ]
      }
    ]
  },
  {
    id: 'series-2',
    title: 'Arcane',
    originalTitle: 'Arcane: League of Legends',
    type: 'series',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    overview: 'Au cœur du conflit entre les cités jumelles de Piltover et Zaun, deux sœurs se battent dans les camps opposés d’une guerre entre technologies magiques et croyances incompatibles.',
    genres: ['Animation', 'Science-Fiction', 'Action', 'Fantastique'],
    releaseYear: 2021,
    rating: 9.0,
    creator: 'Christian Linke, Alex Yee',
    cast: ['Hailee Steinfeld', 'Ella Purnell', 'Kevin Alejandro', 'Katie Leung'],
    totalSeasons: 2,
    totalEpisodes: 18,
    moods: ['Visuellement Sublimé', 'Cérébral & Science-Fiction', 'Émotionnel'],
    addedBy: 'system',
    seasonsData: [
      {
        seasonNumber: 1,
        name: 'Saison 1',
        episodeCount: 9,
        episodes: [
          { episodeNumber: 1, title: 'Welcome to the Playground', durationMinutes: 43 },
          { episodeNumber: 2, title: 'Some Mysteries Are Better Left Unsolved', durationMinutes: 40 },
          { episodeNumber: 3, title: 'The Base Violence Necessary for Change', durationMinutes: 44 },
          { episodeNumber: 4, title: 'Happy Progress Day!', durationMinutes: 40 },
          { episodeNumber: 5, title: 'Everybody Wants to Be My Enemy', durationMinutes: 40 },
          { episodeNumber: 6, title: 'When These Walls Come Tumbling Down', durationMinutes: 42 },
          { episodeNumber: 7, title: 'The Boy Saviour', durationMinutes: 40 },
          { episodeNumber: 8, title: 'Oil and Water', durationMinutes: 40 },
          { episodeNumber: 9, title: 'The Monster You Created', durationMinutes: 41 }
        ]
      },
      {
        seasonNumber: 2,
        name: 'Saison 2',
        episodeCount: 9,
        episodes: [
          { episodeNumber: 1, title: 'Heavy Is the Crown', durationMinutes: 44 },
          { episodeNumber: 2, title: 'Watch It All Burn', durationMinutes: 42 },
          { episodeNumber: 3, title: 'Finally Got the Name Right', durationMinutes: 45 },
          { episodeNumber: 4, title: 'Paint the Town Blue', durationMinutes: 42 },
          { episodeNumber: 5, title: 'Blisters and Bedrock', durationMinutes: 43 },
          { episodeNumber: 6, title: 'The Message Hidden Within the Pattern', durationMinutes: 45 },
          { episodeNumber: 7, title: 'Pretend Like It’s the First Time', durationMinutes: 44 },
          { episodeNumber: 8, title: 'Killing Is a Cycle', durationMinutes: 46 },
          { episodeNumber: 9, title: 'The Dirt Under Your Nails', durationMinutes: 50 }
        ]
      }
    ]
  },
  {
    id: 'series-3',
    title: 'Stranger Things',
    originalTitle: 'Stranger Things',
    type: 'series',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    overview: 'Quand un jeune garçon disparaît dans la petite ville d’Hawkins, ses amis, sa famille et la police locale se retrouvent plongés dans un mystère impliquant des expériences secrètes et des forces surnaturelles.',
    genres: ['Science-Fiction', 'Horreur', 'Drame'],
    releaseYear: 2016,
    rating: 8.7,
    creator: 'Duffer Brothers',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour', 'Gaten Matarazzo'],
    totalSeasons: 4,
    totalEpisodes: 34,
    moods: ['Nostalgique 80s', 'Effrayant & Suspense', 'Soirée pop-corn'],
    addedBy: 'system',
    seasonsData: [
      {
        seasonNumber: 1,
        name: 'Saison 1',
        episodeCount: 8,
        episodes: [
          { episodeNumber: 1, title: 'Chapitre Un : La Disparition de Will Byers', durationMinutes: 48 },
          { episodeNumber: 2, title: 'Chapitre Deux : La Cinglée de la rue Maple', durationMinutes: 55 },
          { episodeNumber: 3, title: 'Chapitre Trois : Petit Papa Noël', durationMinutes: 51 },
          { episodeNumber: 4, title: 'Chapitre Quatre : Le Leucocyte', durationMinutes: 50 },
          { episodeNumber: 5, title: 'Chapitre Cinq : La Puce et l\'Acrobate', durationMinutes: 53 },
          { episodeNumber: 6, title: 'Chapitre Six : Le Monstre', durationMinutes: 47 },
          { episodeNumber: 7, title: 'Chapitre Sept : Le Bain', durationMinutes: 42 },
          { episodeNumber: 8, title: 'Chapitre Huit : Le Monde à l\'envers', durationMinutes: 55 }
        ]
      }
    ]
  },
  {
    id: 'series-4',
    title: 'Severance',
    originalTitle: 'Severance',
    type: 'series',
    poster: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    overview: 'Mark dirige une équipe chez Lumon Industries dont les employés ont subi une procédure d’association dissociative, séparant leurs souvenirs de travail et leur vie privée.',
    genres: ['Science-Fiction', 'Thriller', 'Mystère'],
    releaseYear: 2022,
    rating: 8.7,
    creator: 'Dan Erickson',
    cast: ['Adam Scott', 'Zach Cherry', 'Britt Lower', 'Patricia Arquette', 'John Turturro'],
    totalSeasons: 2,
    totalEpisodes: 19,
    moods: ['Cérébral & Science-Fiction', 'Effrayant & Suspense', 'Captivant'],
    addedBy: 'system',
    seasonsData: [
      {
        seasonNumber: 1,
        name: 'Saison 1',
        episodeCount: 9,
        episodes: [
          { episodeNumber: 1, title: 'Good News About Hell', durationMinutes: 57 },
          { episodeNumber: 2, title: 'Half Loop', durationMinutes: 53 },
          { episodeNumber: 3, title: 'In Perpetuity', durationMinutes: 52 },
          { episodeNumber: 4, title: 'The You You Are', durationMinutes: 54 },
          { episodeNumber: 5, title: 'The Grim Barbarity of Optics and Design', durationMinutes: 52 },
          { episodeNumber: 6, title: 'Hide and Seek', durationMinutes: 45 },
          { episodeNumber: 7, title: 'Defiant Jazz', durationMinutes: 53 },
          { episodeNumber: 8, title: 'What\'s for Dinner?', durationMinutes: 46 },
          { episodeNumber: 9, title: 'The We We Are', durationMinutes: 40 }
        ]
      }
    ]
  },
  {
    id: 'series-5',
    title: 'The Last of Us',
    originalTitle: 'The Last of Us',
    type: 'series',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    overview: 'Quand la civilisation s’effondre à la suite d’une pandémie parasitaire, un survivant endurci est engagé pour faire sortir clandestinement une jeune fille de 14 ans d’une zone de quarantaine oppressante.',
    genres: ['Drame', 'Horreur', 'Aventure', 'Action'],
    releaseYear: 2023,
    rating: 8.8,
    creator: 'Craig Mazin, Neil Druckmann',
    cast: ['Pedro Pascal', 'Bella Ramsey', 'Gabriel Luna', 'Anna Torv'],
    totalSeasons: 1,
    totalEpisodes: 9,
    moods: ['Sombre', 'Émotionnel', 'Effrayant & Suspense'],
    addedBy: 'system',
    seasonsData: [
      {
        seasonNumber: 1,
        name: 'Saison 1',
        episodeCount: 9,
        episodes: [
          { episodeNumber: 1, title: 'When You\'re Lost in the Darkness', durationMinutes: 81 },
          { episodeNumber: 2, title: 'Infected', durationMinutes: 53 },
          { episodeNumber: 3, title: 'Long, Long Time', durationMinutes: 76 },
          { episodeNumber: 4, title: 'Please Hold to My Hand', durationMinutes: 45 },
          { episodeNumber: 5, title: 'Endure and Survive', durationMinutes: 59 },
          { episodeNumber: 6, title: 'Kin', durationMinutes: 59 },
          { episodeNumber: 7, title: 'Left Behind', durationMinutes: 56 },
          { episodeNumber: 8, title: 'When We Are in Need', durationMinutes: 51 },
          { episodeNumber: 9, title: 'Look for the Light', durationMinutes: 43 }
        ]
      }
    ]
  }
];

export const GENRE_OPTIONS = [
  'Tous les genres',
  'Action',
  'Animation',
  'Aventure',
  'Biopic',
  'Comédie',
  'Crime',
  'Documentaire',
  'Drame',
  'Fantastique',
  'Histoire',
  'Horreur',
  'Mystère',
  'Romance',
  'Science-Fiction',
  'Thriller'
];

export const MOOD_OPTIONS = [
  'Toutes les ambiances',
  'Épique',
  'Effrayant & Suspense',
  'Cérébral & Science-Fiction',
  'Inspirant & Réconfortant',
  'Visuellement Sublimé',
  'Intense',
  'Nostalgique 80s',
  'Soirée pop-corn',
  'Sombre',
  'Émotionnel'
];
