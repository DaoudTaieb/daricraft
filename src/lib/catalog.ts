export type CategoryGroup = "mobilier" | "decoration";

export type TaxItem = {
  key: string; // unique (ex: "assises/chaises")
  label: string;
};

export type TaxSection = {
  key: string; // unique (ex: "assises")
  title: string;
  items: TaxItem[];
};

export const CATEGORY_LABELS: Record<CategoryGroup, string> = {
  mobilier: "Mobilier",
  decoration: "Décoration",
};

export const CATALOG_TAXONOMY: Record<CategoryGroup, TaxSection[]> = {
  mobilier: [
    {
      key: "assises",
      title: "Assises",
      items: [
        { key: "assises/chaises", label: "Chaises" },
        { key: "assises/fauteuils", label: "Fauteuils" },
        { key: "assises/bancs", label: "Bancs" },
        { key: "assises/tabourets", label: "Tabourets" },
      ],
    },
    {
      key: "tables",
      title: "Tables",
      items: [
        { key: "tables/tables-a-manger", label: "Tables à manger" },
        { key: "tables/tables-basses", label: "Tables basses" },
        { key: "tables/tables-d-appoint", label: "Tables d’appoint" },
        { key: "tables/bureaux", label: "Bureaux" },
        { key: "tables/consoles", label: "Consoles" },
      ],
    },
    {
      key: "salon",
      title: "Salon",
      items: [
        { key: "salon/tables-basses", label: "Tables basses" },
        { key: "salon/meubles-tv", label: "Meubles TV" },
        { key: "salon/bibliotheques", label: "Bibliothèques" },
        { key: "salon/etagères", label: "Étagères" },
      ],
    },
    {
      key: "chambre-a-coucher",
      title: "Chambre à coucher",
      items: [
        { key: "chambre-a-coucher/lits", label: "Lits" },
        { key: "chambre-a-coucher/tetes-de-lit", label: "Têtes de lit" },
        { key: "chambre-a-coucher/tables-de-chevet", label: "Tables de chevet" },
        { key: "chambre-a-coucher/dressings", label: "Dressings" },
        { key: "chambre-a-coucher/commodes", label: "Commodes" },
      ],
    },
    {
      key: "salle-a-manger",
      title: "Salle à manger",
      items: [
        { key: "salle-a-manger/tables", label: "Tables" },
        { key: "salle-a-manger/chaises", label: "Chaises" },
        { key: "salle-a-manger/buffets", label: "Buffets" },
        { key: "salle-a-manger/vaisseliers", label: "Vaisseliers" },
      ],
    },
  ],
  decoration: [
    {
      key: "decoration",
      title: "Décoration",
      items: [
        { key: "decoration/claustras-separations", label: "Claustras & séparations" },
        { key: "decoration/panneaux-muraux", label: "Panneaux muraux décoratifs" },
        { key: "decoration/miroirs", label: "Miroirs" },
        { key: "decoration/bois-metal", label: "Décoration bois & métal" },
        { key: "decoration/elements-architecturaux", label: "Éléments architecturaux décoratifs" },
      ],
    },
  ],
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string; // image principale (liste)
  images: string[]; // galerie
  description: string;
  dimensions: string;
  features: string[];
  categoryGroup: CategoryGroup;
  subKey: string;
  subLabel: string;
};

// Quelques images Unsplash (démonstration)
const U = {
  chair: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200",
  chair2: "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&q=80&w=1200",
  armchair: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1200",
  bench: "https://images.unsplash.com/photo-1582582429415-4c1a4d513a76?auto=format&fit=crop&q=80&w=1200",
  stool: "https://images.unsplash.com/photo-1616627982851-fc9d2d34b93a?auto=format&fit=crop&q=80&w=1200",
  diningTable: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200",
  coffeeTable: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1200",
  sideTable: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200",
  desk: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200",
  console: "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&q=80&w=1200",
  tvStand: "https://images.unsplash.com/photo-1598300053652-5b19f60795d3?auto=format&fit=crop&q=80&w=1200",
  bookshelf: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200",
  shelves: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200",
  bed: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
  headboard: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=1200",
  nightstand: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1200",
  wardrobe: "https://images.unsplash.com/photo-1582582494700-2f4a5e7f1a8a?auto=format&fit=crop&q=80&w=1200",
  dresser: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200",
  sideboard: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
  cabinet: "https://images.unsplash.com/photo-1615873968403-89a48a6f3aa8?auto=format&fit=crop&q=80&w=1200",
  divider: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200",
  wallPanels: "https://images.unsplash.com/photo-1523413450975-4a1c9f3b3c64?auto=format&fit=crop&q=80&w=1200",
  mirror: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&q=80&w=1200",
  woodMetal: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200",
  arch: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1200",
};

export const MOCK_CATALOG: CatalogProduct[] = [
  // Assises
  {
    id: "m-001",
    categoryGroup: "mobilier",
    subKey: "assises/chaises",
    subLabel: "Chaises",
    name: "Chaise Scandinave Bois",
    slug: "chaise-scandinave-bois",
    price: 14500,
    image: U.chair,
    images: [U.chair, U.chair2],
    description: "Chaise élégante en bois massif, idéale pour une salle à manger moderne.",
    dimensions: "H 82cm x L 46cm x P 52cm",
    features: ["Bois massif", "Finition vernie", "Confort ergonomique", "Fabrication artisanale"],
  },
  {
    id: "m-002",
    categoryGroup: "mobilier",
    subKey: "assises/fauteuils",
    subLabel: "Fauteuils",
    name: "Fauteuil Velours Royal",
    slug: "fauteuil-velours-royal",
    price: 45000,
    image: U.armchair,
    images: [U.armchair, U.chair],
    description: "Fauteuil premium alliant confort moderne et esthétique intemporelle.",
    dimensions: "H 85cm x L 75cm x P 80cm",
    features: ["Structure en hêtre massif", "Velours anti-tâche", "Assise haute résilience", "Finition soignée"],
  },
  {
    id: "m-003",
    categoryGroup: "mobilier",
    subKey: "assises/bancs",
    subLabel: "Bancs",
    name: "Banc Minimal Bois & Métal",
    slug: "banc-minimal-bois-metal",
    price: 22000,
    image: U.bench,
    images: [U.bench, U.woodMetal],
    description: "Banc robuste, parfait pour entrée, salle à manger ou bout de lit.",
    dimensions: "L 140cm x H 45cm x P 40cm",
    features: ["Piètement métal", "Assise bois massif", "Design minimal", "Très stable"],
  },
  {
    id: "m-004",
    categoryGroup: "mobilier",
    subKey: "assises/tabourets",
    subLabel: "Tabourets",
    name: "Tabouret Bar Industriel",
    slug: "tabouret-bar-industriel",
    price: 12500,
    image: U.stool,
    images: [U.stool, U.woodMetal],
    description: "Tabouret haut style industriel, idéal pour îlot de cuisine.",
    dimensions: "H 75cm x L 35cm x P 35cm",
    features: ["Métal thermolaqué", "Assise bois", "Patins anti-rayures", "Facile d’entretien"],
  },

  // Tables
  {
    id: "m-005",
    categoryGroup: "mobilier",
    subKey: "tables/tables-a-manger",
    subLabel: "Tables à manger",
    name: "Table à Manger Chêne",
    slug: "table-a-manger-chene",
    price: 98000,
    image: U.diningTable,
    images: [U.diningTable, U.chair],
    description: "Grande table familiale en chêne, lignes épurées et finition premium.",
    dimensions: "L 200cm x H 75cm x P 95cm",
    features: ["Plateau chêne", "Angles adoucis", "Finition premium", "Conçue pour durer"],
  },
  {
    id: "m-006",
    categoryGroup: "mobilier",
    subKey: "tables/tables-basses",
    subLabel: "Tables basses",
    name: "Table Basse Bois Naturel",
    slug: "table-basse-bois-naturel",
    price: 32000,
    image: U.coffeeTable,
    images: [U.coffeeTable, U.shelves],
    description: "Table basse chaleureuse, parfaite pour un salon contemporain.",
    dimensions: "L 110cm x H 40cm x P 60cm",
    features: ["Bois naturel", "Finition mate", "Design épuré", "Facile à assortir"],
  },
  {
    id: "m-007",
    categoryGroup: "mobilier",
    subKey: "tables/tables-d-appoint",
    subLabel: "Tables d’appoint",
    name: "Table d’Appoint Ronde",
    slug: "table-appoint-ronde",
    price: 16500,
    image: U.sideTable,
    images: [U.sideTable, U.mirror],
    description: "Petite table d’appoint polyvalente, idéale près d’un canapé.",
    dimensions: "Ø 45cm x H 50cm",
    features: ["Compacte", "Stable", "Bois + métal", "Finition soignée"],
  },
  {
    id: "m-008",
    categoryGroup: "mobilier",
    subKey: "tables/bureaux",
    subLabel: "Bureaux",
    name: "Bureau Minimaliste",
    slug: "bureau-minimaliste",
    price: 54000,
    image: U.desk,
    images: [U.desk, U.shelves],
    description: "Bureau moderne pensé pour le télétravail, avec grand plateau.",
    dimensions: "L 140cm x H 75cm x P 65cm",
    features: ["Plateau large", "Gestion câbles", "Structure robuste", "Finition premium"],
  },
  {
    id: "m-009",
    categoryGroup: "mobilier",
    subKey: "tables/consoles",
    subLabel: "Consoles",
    name: "Console Entrée Bois",
    slug: "console-entree-bois",
    price: 38000,
    image: U.console,
    images: [U.console, U.mirror],
    description: "Console fine et élégante, parfaite pour une entrée moderne.",
    dimensions: "L 110cm x H 80cm x P 35cm",
    features: ["Peu profonde", "Finition vernie", "Design intemporel", "Assemblage solide"],
  },

  // Salon
  {
    id: "m-010",
    categoryGroup: "mobilier",
    subKey: "salon/tables-basses",
    subLabel: "Tables basses",
    name: "Table Basse Duo",
    slug: "table-basse-duo",
    price: 42000,
    image: U.coffeeTable,
    images: [U.coffeeTable, U.shelves],
    description: "Ensemble de deux tables basses gigognes, modulables.",
    dimensions: "Ø 70cm + Ø 50cm",
    features: ["Gigognes", "Modulables", "Bois + métal", "Look premium"],
  },
  {
    id: "m-011",
    categoryGroup: "mobilier",
    subKey: "salon/meubles-tv",
    subLabel: "Meubles TV",
    name: "Meuble TV Noyer",
    slug: "meuble-tv-noyer",
    price: 76000,
    image: U.tvStand,
    images: [U.tvStand, U.shelves],
    description: "Meuble TV avec rangements, style noyer et lignes contemporaines.",
    dimensions: "L 180cm x H 55cm x P 40cm",
    features: ["Rangements", "Passe-câbles", "Bois premium", "Finition matte"],
  },
  {
    id: "m-012",
    categoryGroup: "mobilier",
    subKey: "salon/bibliotheques",
    subLabel: "Bibliothèques",
    name: "Bibliothèque Modulaire",
    slug: "bibliotheque-modulaire",
    price: 89000,
    image: U.bookshelf,
    images: [U.bookshelf, U.shelves],
    description: "Bibliothèque modulable pour s’adapter à votre espace.",
    dimensions: "L 160cm x H 200cm x P 35cm",
    features: ["Modulaire", "Solide", "Design minimal", "Grande capacité"],
  },
  {
    id: "m-013",
    categoryGroup: "mobilier",
    subKey: "salon/etagères",
    subLabel: "Étagères",
    name: "Étagères Murales",
    slug: "etagères-murales",
    price: 18000,
    image: U.shelves,
    images: [U.shelves, U.wallPanels],
    description: "Étagères murales pour exposer vos objets et optimiser l’espace.",
    dimensions: "Lot 3: L 60cm / 80cm / 100cm",
    features: ["Fixations incluses", "Bois premium", "Faciles à poser", "Look contemporain"],
  },

  // Chambre à coucher
  {
    id: "m-014",
    categoryGroup: "mobilier",
    subKey: "chambre-a-coucher/lits",
    subLabel: "Lits",
    name: "Lit Cadre Bois",
    slug: "lit-cadre-bois",
    price: 125000,
    image: U.bed,
    images: [U.bed, U.headboard],
    description: "Lit en bois massif avec design épuré, confort et robustesse.",
    dimensions: "160x200cm",
    features: ["Bois massif", "Structure stable", "Finition premium", "Assemblage durable"],
  },
  {
    id: "m-015",
    categoryGroup: "mobilier",
    subKey: "chambre-a-coucher/tetes-de-lit",
    subLabel: "Têtes de lit",
    name: "Tête de Lit Capitonnée",
    slug: "tete-de-lit-capitonnee",
    price: 39000,
    image: U.headboard,
    images: [U.headboard, U.bed],
    description: "Tête de lit confortable et élégante, style hôtel.",
    dimensions: "Pour lit 160cm",
    features: ["Revêtement premium", "Confort", "Fixations", "Finition soignée"],
  },
  {
    id: "m-016",
    categoryGroup: "mobilier",
    subKey: "chambre-a-coucher/tables-de-chevet",
    subLabel: "Tables de chevet",
    name: "Table de Chevet Noyer",
    slug: "table-de-chevet-noyer",
    price: 22000,
    image: U.nightstand,
    images: [U.nightstand, U.mirror],
    description: "Table de chevet compacte avec rangement discret.",
    dimensions: "L 45cm x H 55cm x P 35cm",
    features: ["1 tiroir", "Bois premium", "Poignées métal", "Stable"],
  },
  {
    id: "m-017",
    categoryGroup: "mobilier",
    subKey: "chambre-a-coucher/dressings",
    subLabel: "Dressings",
    name: "Dressing Sur Mesure",
    slug: "dressing-sur-mesure",
    price: 210000,
    image: U.wardrobe,
    images: [U.wardrobe, U.shelves],
    description: "Dressing optimisé, configurable selon vos besoins.",
    dimensions: "Sur mesure",
    features: ["Modules", "Tiroirs", "Portes au choix", "Optimisation espace"],
  },
  {
    id: "m-018",
    categoryGroup: "mobilier",
    subKey: "chambre-a-coucher/commodes",
    subLabel: "Commodes",
    name: "Commode 6 Tiroirs",
    slug: "commode-6-tiroirs",
    price: 68000,
    image: U.dresser,
    images: [U.dresser, U.woodMetal],
    description: "Commode élégante pour organiser vos vêtements.",
    dimensions: "L 120cm x H 85cm x P 45cm",
    features: ["6 tiroirs", "Glissières solides", "Finition premium", "Design intemporel"],
  },

  // Salle à manger
  {
    id: "m-019",
    categoryGroup: "mobilier",
    subKey: "salle-a-manger/tables",
    subLabel: "Tables",
    name: "Table Salle à Manger",
    slug: "table-salle-a-manger",
    price: 99000,
    image: U.diningTable,
    images: [U.diningTable, U.chair],
    description: "Table parfaite pour recevoir, design sobre et chaleureux.",
    dimensions: "L 180cm x H 75cm x P 90cm",
    features: ["Bois massif", "Finition satinée", "Stabilité", "Longévité"],
  },
  {
    id: "m-020",
    categoryGroup: "mobilier",
    subKey: "salle-a-manger/chaises",
    subLabel: "Chaises",
    name: "Chaise Confort Tissu",
    slug: "chaise-confort-tissu",
    price: 17500,
    image: U.chair2,
    images: [U.chair2, U.chair],
    description: "Chaise rembourrée pour de longs repas confortables.",
    dimensions: "H 84cm x L 48cm x P 55cm",
    features: ["Tissu premium", "Assise confort", "Pieds bois", "Facile à assortir"],
  },
  {
    id: "m-021",
    categoryGroup: "mobilier",
    subKey: "salle-a-manger/buffets",
    subLabel: "Buffets",
    name: "Buffet Bas Noyer",
    slug: "buffet-bas-noyer",
    price: 112000,
    image: U.sideboard,
    images: [U.sideboard, U.cabinet],
    description: "Buffet bas avec rangements, idéal pour salle à manger.",
    dimensions: "L 200cm x H 80cm x P 45cm",
    features: ["Portes + tiroirs", "Bois premium", "Finition mate", "Grande capacité"],
  },
  {
    id: "m-022",
    categoryGroup: "mobilier",
    subKey: "salle-a-manger/vaisseliers",
    subLabel: "Vaisseliers",
    name: "Vaisselier Vitré",
    slug: "vaisselier-vitre",
    price: 155000,
    image: U.cabinet,
    images: [U.cabinet, U.sideboard],
    description: "Vaisselier vitré pour exposer votre vaisselle et vos pièces déco.",
    dimensions: "L 120cm x H 200cm x P 45cm",
    features: ["Vitrines", "Étagères", "Rangements bas", "Éclairage optionnel"],
  },

  // Décoration
  {
    id: "d-001",
    categoryGroup: "decoration",
    subKey: "decoration/claustras-separations",
    subLabel: "Claustras & séparations",
    name: "Claustra Bois Design",
    slug: "claustra-bois-design",
    price: 65000,
    image: U.divider,
    images: [U.divider, U.wallPanels],
    description: "Séparation décorative pour structurer l’espace sans le fermer.",
    dimensions: "Sur mesure",
    features: ["Sur mesure", "Bois premium", "Pose facile", "Design moderne"],
  },
  {
    id: "d-002",
    categoryGroup: "decoration",
    subKey: "decoration/panneaux-muraux",
    subLabel: "Panneaux muraux décoratifs",
    name: "Panneaux Muraux Bois",
    slug: "panneaux-muraux-bois",
    price: 42000,
    image: U.wallPanels,
    images: [U.wallPanels, U.woodMetal],
    description: "Panneaux décoratifs pour donner du relief et du caractère à vos murs.",
    dimensions: "Pack 2m²",
    features: ["Acoustique", "Pose simple", "Finition premium", "Rendu chaleureux"],
  },
  {
    id: "d-003",
    categoryGroup: "decoration",
    subKey: "decoration/miroirs",
    subLabel: "Miroirs",
    name: "Miroir Arche",
    slug: "miroir-arche",
    price: 28000,
    image: U.mirror,
    images: [U.mirror, U.console],
    description: "Miroir arche pour agrandir visuellement l’espace.",
    dimensions: "H 160cm x L 60cm",
    features: ["Verre haute clarté", "Cadre fin", "Fixations", "Style intemporel"],
  },
  {
    id: "d-004",
    categoryGroup: "decoration",
    subKey: "decoration/bois-metal",
    subLabel: "Décoration bois & métal",
    name: "Étagère Déco Bois & Métal",
    slug: "etagere-deco-bois-metal",
    price: 24000,
    image: U.woodMetal,
    images: [U.woodMetal, U.shelves],
    description: "Pièce déco murale mêlant bois et métal pour un style industriel chic.",
    dimensions: "L 80cm x H 25cm",
    features: ["Métal thermolaqué", "Bois massif", "Fixations", "Design premium"],
  },
  {
    id: "d-005",
    categoryGroup: "decoration",
    subKey: "decoration/elements-architecturaux",
    subLabel: "Éléments architecturaux décoratifs",
    name: "Arche Décorative",
    slug: "arche-decorative",
    price: 88000,
    image: U.arch,
    images: [U.arch, U.wallPanels],
    description: "Élément architectural décoratif pour personnaliser vos volumes intérieurs.",
    dimensions: "Sur mesure",
    features: ["Sur mesure", "Finition premium", "Pose possible", "Design unique"],
  },
];

export function getTaxonomy(group: CategoryGroup): TaxSection[] {
  return CATALOG_TAXONOMY[group] ?? [];
}

export function getSubLabel(group: CategoryGroup, subKey: string): string | undefined {
  const taxonomy = getTaxonomy(group);
  for (const section of taxonomy) {
    if (section.key === subKey) return section.title;
    for (const item of section.items) {
      if (item.key === subKey) return item.label;
    }
  }
  return undefined;
}

export function getProductsForGroup(group: CategoryGroup): CatalogProduct[] {
  return MOCK_CATALOG.filter((p) => p.categoryGroup === group);
}

export function getProductsForSub(group: CategoryGroup, subKey: string): CatalogProduct[] {
  const taxonomy = getTaxonomy(group);
  const section = taxonomy.find((s) => s.key === subKey);
  const products = getProductsForGroup(group);

  if (section) {
    const keys = new Set(section.items.map((i) => i.key));
    return products.filter((p) => keys.has(p.subKey));
  }

  return products.filter((p) => p.subKey === subKey);
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return MOCK_CATALOG.find((p) => p.slug === slug);
}

