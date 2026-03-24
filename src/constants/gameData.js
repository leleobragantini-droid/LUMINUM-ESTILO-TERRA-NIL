export const PHASES = {
  1: { id: 1, name: "Estabilização", description: "Estabilize a química da água neutralizando acidez e temperatura." },
  2: { id: 2, name: "Semeadura", description: "Plante diferentes tipos de corais para gerar Energia Fotossintética." },
  3: { id: 3, name: "Reintrodução da Fauna", description: "Traga vida animal para criar equilíbrio." },
  4: { id: 4, name: "Reciclagem", description: "Remova o maquinário e deixe o recife autossustentável." }
};

export const TOOLS = {
  // Phase 1 Tools
  purifier: {
    id: 'purifier', name: 'Purificador de Carbonato',
    phase: 1, cost: 20, type: 'machine',
    desc: 'Reduz a acidez local.',
    icon: 'Droplet'
  },
  cooler: {
    id: 'cooler', name: 'Resfriador Geotérmico',
    phase: 1, cost: 20, type: 'machine',
    desc: 'Reduz a temperatura local da água.',
    icon: 'ThermometerSnowflake'
  },
  
  // Phase 2 Tools
  brain_coral: {
    id: 'brain_coral', name: 'Coral Cérebro',
    phase: 2, cost: 30, type: 'coral',
    desc: 'Gera 2 Energias Fotossintéticas/s.',
    icon: 'Brain'
  },
  fire_coral: {
    id: 'fire_coral', name: 'Coral de Fogo',
    phase: 2, cost: 20, type: 'coral',
    desc: 'Gera 1 Energia/s. Mais resistente a temperaturas altas.',
    icon: 'Flame'
  },
  fan_coral: {
    id: 'fan_coral', name: 'Coral Leque',
    phase: 2, cost: 40, type: 'coral',
    desc: 'Gera 3 Energia/s. Mais sensível à acidez.',
    icon: 'Wind'
  },

  // Phase 3 Tools
  octopus: {
    id: 'octopus', name: 'Polvo',
    phase: 3, cost: 50, type: 'fauna',
    desc: 'Controla algas invasoras.',
    icon: 'Tent' 
  },
  turtle: {
    id: 'turtle', name: 'Tartaruga',
    phase: 3, cost: 100, type: 'fauna',
    desc: 'Mantém o equilíbrio do recife (+500 pontos vitais).',
    icon: 'Shield'
  },
  shark: {
    id: 'shark', name: 'Tubarão de Recife',
    phase: 3, cost: 150, type: 'fauna',
    desc: 'Predador topo, consolida a saúde da fauna.',
    icon: 'FishSymbol'
  },

  // Special Tools
  bio_cement: {
    id: 'bio_cement', name: 'Bio-Cimento',
    phase: null, cost: 15, type: 'action',
    desc: 'Conserta estruturas de corais quebradas pela acidez.',
    icon: 'Hammer'
  },
  algae_seeder: {
    id: 'algae_seeder', name: 'Semeador de Algas',
    phase: null, cost: 25, type: 'action',
    desc: 'Recupera a cor de corais branqueados.',
    icon: 'Sprout'
  },
  mangrove: {
    id: 'mangrove', name: 'Manguezal Costeiro',
    phase: null, cost: 80, type: 'mangrove',
    desc: 'Planta apenas nas bordas. Filtra água de forma global.',
    icon: 'Trees'
  },
  
  // Phase 4 Tools
  recycler: {
    id: 'recycler', name: 'Reciclador',
    phase: 4, cost: 0, type: 'action', // returns energy
    desc: 'Remove máquinas, recuperando 10 energia.',
    icon: 'Recycle'
  }
};

export const INITIAL_ENERGY = 150;
export const GRID_SIZE = 12; // 12x12 grid
