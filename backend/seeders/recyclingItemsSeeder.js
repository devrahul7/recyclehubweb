import { RecyclingItem } from '../models/index.js';

const recyclingItemsData = [
  // Paper Category
  {
    itemId: 'paper_1',
    name: 'Newspaper',
    price: 'Est. Rs.9/Kgs',
    description: 'What are you going to do with old news anyway',
    category: 'Paper',
    image: '/assets/newspaper.jpg',
    sortOrder: 1
  },
  {
    itemId: 'paper_2',
    name: 'Magazines',
    price: 'Est. Rs.7/Kgs',
    description: 'Even guests prefer new issues',
    category: 'Paper',
    image: '/assets/magazine.jpg',
    sortOrder: 2
  },
  {
    itemId: 'paper_3',
    name: 'Books & Magazine',
    price: 'Est. Rs.8/Kgs',
    description: 'Give your book a new life',
    category: 'Paper',
    image: '/assets/booksmagazine.jpg',
    sortOrder: 3
  },
  {
    itemId: 'paper_4',
    name: 'Cardboard',
    price: 'Est. Rs.9/Kgs',
    description: "Don't hoard the board",
    category: 'Paper',
    image: '/assets/cardboard.jpg',
    sortOrder: 4
  },
  {
    itemId: 'paper_5',
    name: 'Copy',
    price: 'Est. Rs.12/Kgs',
    description: 'Copy, paste, recycle',
    category: 'Paper',
    image: '/assets/copy.jpg',
    sortOrder: 5
  },
  {
    itemId: 'paper_6',
    name: 'Egg crates',
    price: 'Est. Rs.5/Kgs',
    description: 'Create new crates',
    category: 'Paper',
    image: '/assets/eggcrates.jpg',
    sortOrder: 6
  },
  {
    itemId: 'paper_7',
    name: 'Invitation cards',
    price: 'Est. Rs.6/Kgs',
    description: 'You are invited to recycle',
    category: 'Paper',
    image: '/assets/invitationcard.jpg',
    sortOrder: 7
  },
  {
    itemId: 'paper_8',
    name: 'Carton',
    price: 'Est. Rs.8/Kgs',
    description: 'Carton recycling made easy',
    category: 'Paper',
    image: '/assets/cartoon.jpg',
    sortOrder: 8
  },
  {
    itemId: 'paper_9',
    name: 'Confidential Documents',
    price: 'Est. Rs.7/Kgs',
    description: 'Secure document disposal',
    category: 'Paper',
    image: '/assets/confidental.jpg',
    sortOrder: 9
  },
  // Glass and Plastic Category
  {
    itemId: 'plastic_1',
    name: 'Plastic Bottles',
    price: 'Est. Rs.15/Kgs',
    description: 'Clear and colored plastic bottles',
    category: 'Glass and Plastic',
    image: '/assets/plasticbottle.jpg',
    sortOrder: 10
  },
  {
    itemId: 'glass_1',
    name: 'Glass Bottles',
    price: 'Est. Rs.8/Kgs',
    description: 'Beer, wine, and beverage bottles',
    category: 'Glass and Plastic',
    image: '/assets/glassbottles.jpg',
    sortOrder: 11
  },
  {
    itemId: 'plastic_2',
    name: 'Plastic Bags',
    price: 'Est. Rs.10/Kgs',
    description: 'Shopping and grocery bags',
    category: 'Glass and Plastic',
    image: '/assets/plasticbag.jpeg',
    sortOrder: 12
  },
  {
    itemId: 'plastic_3',
    name: 'Plastic Containers',
    price: 'Est. Rs.12/Kgs',
    description: 'Food containers and tubs',
    category: 'Glass and Plastic',
    image: '/assets/plasticcontainer.jpg',
    sortOrder: 13
  },
  {
    itemId: 'glass_2',
    name: 'Glass Jars',
    price: 'Est. Rs.6/Kgs',
    description: 'Pickle and jam jars',
    category: 'Glass and Plastic',
    image: '/assets/glassjars.jpg',
    sortOrder: 14
  },
  {
    itemId: 'plastic_4',
    name: 'Plastic Cups',
    price: 'Est. Rs.8/Kgs',
    description: 'Disposable cups and glasses',
    category: 'Glass and Plastic',
    image: '/assets/plasticcup.jpeg',
    sortOrder: 15
  },
  {
    itemId: 'plastic_5',
    name: 'Plastic Tubes',
    price: 'Est. Rs.14/Kgs',
    description: 'Cosmetic and toothpaste tubes',
    category: 'Glass and Plastic',
    image: '/assets/plastictubes.webp',
    sortOrder: 16
  },
  {
    itemId: 'plastic_6',
    name: 'Plastic Wrappers',
    price: 'Est. Rs.5/Kgs',
    description: 'Food packaging wrappers',
    category: 'Glass and Plastic',
    image: '/assets/plasticwrappers.jpeg',
    sortOrder: 17
  },
  {
    itemId: 'plastic_7',
    name: 'Plastic Toys',
    price: 'Est. Rs.7/Kgs',
    description: 'Broken or unused plastic toys',
    category: 'Glass and Plastic',
    image: '/assets/plastictoys.jpg',
    sortOrder: 18
  },
  // Metal & Steel Category
  {
    itemId: 'metal_1',
    name: 'Aluminum Cans',
    price: 'Est. Rs.120/Kgs',
    description: 'Beverage cans and containers',
    category: 'Metal & Steel',
    image: '/assets/alumuniumcans.jpeg',
    sortOrder: 19
  },
  {
    itemId: 'metal_2',
    name: 'Iron Scrap',
    price: 'Est. Rs.25/Kgs',
    description: 'Old iron pieces and rods',
    category: 'Metal & Steel',
    image: '/assets/ironscrap.jpeg',
    sortOrder: 20
  },
  {
    itemId: 'metal_3',
    name: 'Copper Wire',
    price: 'Est. Rs.580/Kgs',
    description: 'Electrical copper wiring',
    category: 'Metal & Steel',
    image: '/assets/copperwire.jpeg',
    sortOrder: 21
  },
  {
    itemId: 'metal_4',
    name: 'Steel Items',
    price: 'Est. Rs.28/Kgs',
    description: 'Steel utensils and appliances',
    category: 'Metal & Steel',
    image: '/assets/steelitems.jpeg',
    sortOrder: 22
  },
  {
    itemId: 'metal_5',
    name: 'Mixed Metal Wire',
    price: 'Est. Rs.45/Kgs',
    description: 'Various metal wires and cables',
    category: 'Metal & Steel',
    image: '/assets/mixedmetalwire.jpeg',
    sortOrder: 23
  },
  {
    itemId: 'metal_6',
    name: 'Heavy Metal Scrap',
    price: 'Est. Rs.22/Kgs',
    description: 'Large metal pieces and machinery parts',
    category: 'Metal & Steel',
    image: '/assets/heavymetalscrap.jpeg',
    sortOrder: 24
  },
  // E-waste Category
  {
    itemId: 'ewaste_1',
    name: 'Mobile Phones',
    price: 'Est. Rs.50/piece',
    description: 'Old smartphones and feature phones',
    category: 'E-waste',
    image: '/assets/mobilephones.jpeg',
    sortOrder: 25
  },
  {
    itemId: 'ewaste_2',
    name: 'Laptops',
    price: 'Est. Rs.200/piece',
    description: 'Broken or old laptops',
    category: 'E-waste',
    image: '/assets/laptoprecycle.jpeg',
    sortOrder: 26
  },
  {
    itemId: 'ewaste_3',
    name: 'Television',
    price: 'Est. Rs.150/piece',
    description: 'CRT and LCD televisions',
    category: 'E-waste',
    image: '/assets/television.jpeg',
    sortOrder: 27
  },
  {
    itemId: 'ewaste_4',
    name: 'Printers',
    price: 'Est. Rs.100/piece',
    description: 'Inkjet and laser printers',
    category: 'E-waste',
    image: '/assets/printer.jpeg',
    sortOrder: 28
  },
  {
    itemId: 'ewaste_5',
    name: 'Batteries',
    price: 'Est. Rs.80/Kgs',
    description: 'Mobile and laptop batteries',
    category: 'E-waste',
    image: '/assets/battery.jpeg',
    sortOrder: 29
  },
  {
    itemId: 'ewaste_6',
    name: 'Circuit Boards',
    price: 'Est. Rs.300/Kgs',
    description: 'Computer and electronic boards',
    category: 'E-waste',
    image: '/assets/circuitimage.jpeg',
    sortOrder: 30
  },
  // Brass Category
  {
    itemId: 'brass_1',
    name: 'Brass Pipes',
    price: 'Est. Rs.380/Kgs',
    description: 'Plumbing brass pipes and fittings',
    category: 'Brass',
    image: '/assets/brassimage.jpeg',
    sortOrder: 31
  },
  {
    itemId: 'brass_2',
    name: 'Brass Vessels',
    price: 'Est. Rs.350/Kgs',
    description: 'Traditional brass utensils',
    category: 'Brass',
    image: '/assets/brassvessel.jpeg',
    sortOrder: 32
  },
  {
    itemId: 'brass_3',
    name: 'Brass Fittings',
    price: 'Est. Rs.370/Kgs',
    description: 'Door handles and decorative items',
    category: 'Brass',
    image: '/assets/brassfittings.jpeg',
    sortOrder: 33
  },
  // Others Category
  {
    itemId: 'others_1',
    name: 'Rubber Items',
    price: 'Est. Rs.15/Kgs',
    description: 'Rubber tubes and sheets',
    category: 'Others',
    image: '/assets/rubberwaste.jpeg',
    sortOrder: 34
  },
  {
    itemId: 'others_2',
    name: 'Fabric Waste',
    price: 'Est. Rs.8/Kgs',
    description: 'Old clothes and textiles',
    category: 'Others',
    image: '/assets/fabrics.jpeg',
    sortOrder: 35
  },
  {
    itemId: 'others_3',
    name: 'Wood Scrap',
    price: 'Est. Rs.5/Kgs',
    description: 'Wooden furniture pieces',
    category: 'Others',
    image: '/assets/woodscrap.jpg',
    sortOrder: 36
  }
];

export const seedRecyclingItems = async () => {
  try {
    // Check if items already exist
    const existingItems = await RecyclingItem.findAll();
    if (existingItems.length > 0) {
      console.log('Recycling items already seeded');
      return;
    }

    // Create all items
    await RecyclingItem.bulkCreate(recyclingItemsData);
    console.log('Recycling items seeded successfully');
  } catch (error) {
    console.error('Error seeding recycling items:', error);
  }
}; 