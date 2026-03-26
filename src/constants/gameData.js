export const PHASES = Object.freeze({
  1: Object.freeze({ id: 1, name: "Estabilização", description: "Estabilize a química da água neutralizando acidez e temperatura. A acidez e temperatura sobem rápido — use purificadores e resfriadores antes que seja tarde demais!" }),
  2: Object.freeze({ id: 2, name: "Semeadura", description: "Plante corais para gerar Energia Fotossintética. Cuidado: os corais morrem se a acidez ou temperatura subirem novamente!" }),
  3: Object.freeze({ id: 3, name: "Reintrodução da Fauna", description: "Traga vida animal para criar equilíbrio ecológico. Introduza 5 espécies diferentes para avançar." }),
  4: Object.freeze({ id: 4, name: "Reciclagem", description: "Remova TODO o maquinário e deixe o recife autossustentável. Quando todas as máquinas forem removidas, o recife estará salvo!" }),
});

export const TOOLS = Object.freeze({
  // Phase 1 Tools
  purifier: Object.freeze({
    id: 'purifier', name: 'Purificador de Carbonato',
    phase: 1, cost: 30, type: 'machine',
    desc: 'Reduz a acidez local. Custa mais energia mas é essencial na fase 1.',
    icon: 'Droplet'
  }),
  cooler: Object.freeze({
    id: 'cooler', name: 'Resfriador Geotérmico',
    phase: 1, cost: 30, type: 'machine',
    desc: 'Reduz a temperatura local da água.',
    icon: 'ThermometerSnowflake'
  }),
  
  // Phase 2 Tools
  brain_coral: Object.freeze({
    id: 'brain_coral', name: 'Coral Cérebro',
    phase: 2, cost: 40, type: 'coral',
    desc: 'Gera 2 Energias/tick. Moderadamente sensível a acidez e temperatura.',
    icon: 'Brain'
  }),
  fire_coral: Object.freeze({
    id: 'fire_coral', name: 'Coral de Fogo',
    phase: 2, cost: 30, type: 'coral',
    desc: 'Gera 1 Energia/tick. Resistente a alta temperatura.',
    icon: 'Flame'
  }),
  fan_coral: Object.freeze({
    id: 'fan_coral', name: 'Coral Leque',
    phase: 2, cost: 60, type: 'coral',
    desc: 'Gera 3 Energia/tick. Muito sensível à acidez — proteja-o bem!',
    icon: 'Wind'
  }),

  // Phase 3 Tools
  octopus: Object.freeze({
    id: 'octopus', name: 'Polvo',
    phase: 3, cost: 80, type: 'fauna',
    desc: 'Controla algas invasoras e aumenta biodiversidade.',
    icon: 'Tent' 
  }),
  turtle: Object.freeze({
    id: 'turtle', name: 'Tartaruga',
    phase: 3, cost: 120, type: 'fauna',
    desc: 'Mantém o equilíbrio do recife. Aumenta biodiversidade.',
    icon: 'Shield'
  }),
  shark: Object.freeze({
    id: 'shark', name: 'Tubarão de Recife',
    phase: 3, cost: 180, type: 'fauna',
    desc: 'Predador topo. Consolida a saúde da fauna e aumenta biodiversidade.',
    icon: 'FishSymbol'
  }),

  // Special Tools
  bio_cement: Object.freeze({
    id: 'bio_cement', name: 'Bio-Cimento',
    phase: null, cost: 20, type: 'action',
    desc: 'Conserta corais quebrados pela acidez.',
    icon: 'Hammer'
  }),
  algae_seeder: Object.freeze({
    id: 'algae_seeder', name: 'Semeador de Algas',
    phase: null, cost: 35, type: 'action',
    desc: 'Recupera a cor de corais branqueados.',
    icon: 'Sprout'
  }),
  mangrove: Object.freeze({
    id: 'mangrove', name: 'Manguezal Costeiro',
    phase: null, cost: 100, type: 'mangrove',
    desc: 'Plante apenas nas bordas do mapa. Filtra água globalmente.',
    icon: 'Trees'
  }),
  
  // Phase 4 Tools
  recycler: Object.freeze({
    id: 'recycler', name: 'Reciclador',
    phase: 4, cost: 0, type: 'action',
    desc: 'Remove máquinas do grid, recuperando 10 energia.',
    icon: 'Recycle'
  })
});

export const INITIAL_ENERGY = 100; // Less starting energy = harder
export const GRID_SIZE = 12;
