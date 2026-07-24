import { User } from '../models/User';
import { Item } from '../models/Item';
import { SwapRequest } from '../models/SwapRequest';
import { ChatMessage } from '../models/ChatMessage';
import { hashPassword } from './password.utils';

export const seedDatabaseIfEmpty = async (force: boolean = false) => {
  try {
    const itemCount = await Item.countDocuments();
    if (itemCount > 10 && !force) {
      console.log('📦 Database already seeded with items.');
      return;
    }

    if (force) {
      await Item.deleteMany({});
      await SwapRequest.deleteMany({});
      await ChatMessage.deleteMany({});
      await User.deleteMany({ email: { $in: ['alex@rewear.com', 'admin@rewear.com', 'jordan@rewear.com', 'maya@rewear.com'] } });
    }

    console.log('🌱 Seeding database with production Indian clothing items, users, and swaps...');

    const defaultPasswordHash = await hashPassword('password123');

    // 1. Core Believable Indian Swapper Users
    let alex = await User.findOne({ email: 'alex@rewear.com' });
    if (!alex) {
      alex = await User.create({
        name: 'Aarav Sharma',
        email: 'alex@rewear.com',
        passwordHash: defaultPasswordHash,
        role: 'USER',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        bio: 'Sustainable fashion advocate & vintage denim collector based in Indiranagar, Bangalore.',
        location: 'Bangalore',
        swapCount: 14,
        ratingAverage: 4.9,
        ratingCount: 12,
      });
    }

    let admin = await User.findOne({ email: 'admin@rewear.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Priya Patel',
        email: 'admin@rewear.com',
        passwordHash: defaultPasswordHash,
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        bio: 'ReWear platform curator & community manager based in Connaught Place, Delhi.',
        location: 'Delhi',
        swapCount: 28,
        ratingAverage: 5.0,
        ratingCount: 24,
      });
    }

    let jordan = await User.findOne({ email: 'jordan@rewear.com' });
    if (!jordan) {
      jordan = await User.create({
        name: 'Rohan Gupta',
        email: 'jordan@rewear.com',
        passwordHash: defaultPasswordHash,
        role: 'USER',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        bio: 'Streetwear enthusiast & sneakerhead swapping in Bandra West, Mumbai.',
        location: 'Mumbai',
        swapCount: 9,
        ratingAverage: 4.8,
        ratingCount: 8,
      });
    }

    let maya = await User.findOne({ email: 'maya@rewear.com' });
    if (!maya) {
      maya = await User.create({
        name: 'Ananya Kapoor',
        email: 'maya@rewear.com',
        passwordHash: defaultPasswordHash,
        role: 'USER',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
        bio: 'Minimalist capsule wardrobe advocate & thrift curator in Sector 18, Noida.',
        location: 'Noida',
        swapCount: 19,
        ratingAverage: 4.95,
        ratingCount: 15,
      });
    }

    // 2. Realistic Production Clothing Catalog
    const itemsData = [
      {
        owner: alex._id,
        title: 'Nike Sports Hoodie',
        description: 'Authentic fleece pullover Nike Sports Hoodie with embroidered swoosh logo. Ultra-soft fleece lining in pristine condition.',
        category: 'Tops',
        brand: 'Nike',
        gender: 'Unisex',
        size: 'L',
        condition: 'Like New',
        material: '80% Cotton / 20% Polyester',
        color: 'Heather Grey',
        valueEstimate: 140,
        location: 'Bangalore',
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
        ],
        tags: ['nike', 'hoodie', 'sports', 'streetwear'],
        status: 'AVAILABLE',
        likesCount: 42,
        viewsCount: 310,
      },
      {
        owner: jordan._id,
        title: "Levi's 501 Jeans",
        description: "Classic 100% cotton rigid Levi's 501 Original Fit denim jeans. Authentic indigo wash with classic red tab detail.",
        category: 'Pants',
        brand: "Levi's",
        gender: 'Men',
        size: '32x32',
        condition: 'Like New',
        material: '100% Cotton Denim',
        color: 'Dark Indigo',
        valueEstimate: 110,
        location: 'Mumbai',
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800',
        ],
        tags: ['levis', '501', 'jeans', 'denim'],
        status: 'AVAILABLE',
        likesCount: 58,
        viewsCount: 420,
      },
      {
        owner: maya._id,
        title: 'Zara Linen Shirt',
        description: 'Breathable 100% organic Zara linen button-down casual shirt. Perfect relaxed fit for warm summer weather.',
        category: 'Tops',
        brand: 'Zara',
        gender: 'Women',
        size: 'M',
        condition: 'Like New',
        material: '100% Pure Linen',
        color: 'Pure White',
        valueEstimate: 85,
        location: 'Noida',
        images: [
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800',
        ],
        tags: ['zara', 'linen', 'shirt', 'summer'],
        status: 'AVAILABLE',
        likesCount: 26,
        viewsCount: 190,
      },
      {
        owner: alex._id,
        title: 'H&M Oversized Hoodie',
        description: 'Cozy relaxed fit H&M oversized drop-shoulder hoodie in muted sage green. Thick heavy fabric with front pouch pocket.',
        category: 'Tops',
        brand: 'H&M',
        gender: 'Unisex',
        size: 'XL',
        condition: 'Like New',
        material: 'Organic Cotton Blend',
        color: 'Sage Green',
        valueEstimate: 65,
        location: 'Bangalore',
        images: [
          'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
        ],
        tags: ['hm', 'hoodie', 'oversized', 'cozy'],
        status: 'AVAILABLE',
        likesCount: 39,
        viewsCount: 280,
      },
      {
        owner: admin._id,
        title: 'Uniqlo Jacket',
        description: 'Ultra Light Down Uniqlo Jacket with water-repellent coating and packable carrying pouch. Lightweight warmth.',
        category: 'Outerwear',
        brand: 'Uniqlo',
        gender: 'Unisex',
        size: 'L',
        condition: 'Like New',
        material: 'Nylon / Down Fill',
        color: 'Matte Black',
        valueEstimate: 125,
        location: 'Delhi',
        images: [
          'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
        ],
        tags: ['uniqlo', 'jacket', 'outerwear', 'down'],
        status: 'AVAILABLE',
        likesCount: 31,
        viewsCount: 245,
      },
      {
        owner: jordan._id,
        title: 'Adidas Running Shorts',
        description: 'Lightweight breathable Adidas AEROREADY athletic running shorts with mesh liner and reflective accents.',
        category: 'Pants',
        brand: 'Adidas',
        gender: 'Men',
        size: 'M',
        condition: 'Like New',
        material: 'Recycled Polyester',
        color: 'Navy Blue',
        valueEstimate: 50,
        location: 'Mumbai',
        images: [
          'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800',
        ],
        tags: ['adidas', 'shorts', 'running', 'sportswear'],
        status: 'AVAILABLE',
        likesCount: 19,
        viewsCount: 165,
      },
      {
        owner: maya._id,
        title: 'Puma Sweatshirt',
        description: 'Classic Puma Essentials crewneck sweatshirt with retro embroidered logo chest print. Soft fleece interior.',
        category: 'Tops',
        brand: 'Puma',
        gender: 'Women',
        size: 'S',
        condition: 'Like New',
        material: 'Cotton Polyester',
        color: 'Burgundy',
        valueEstimate: 75,
        location: 'Noida',
        images: [
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
        ],
        tags: ['puma', 'sweatshirt', 'crewneck'],
        status: 'AVAILABLE',
        likesCount: 28,
        viewsCount: 210,
      },
      {
        owner: alex._id,
        title: 'Puma Retro Track Jacket',
        description: 'Vintage-style Puma T7 zip-up track jacket with iconic side stripe taping. Excellent condition with smooth zipper.',
        category: 'Outerwear',
        brand: 'Puma',
        gender: 'Unisex',
        size: 'M',
        condition: 'Good',
        material: 'Polyester Tricot',
        color: 'Black / White',
        valueEstimate: 95,
        location: 'Hyderabad',
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
        ],
        tags: ['puma', 'tracksuit', 'vintage', 'streetwear'],
        status: 'AVAILABLE',
        likesCount: 44,
        viewsCount: 340,
      },
    ];

    const createdItems = await Item.insertMany(itemsData);

    // 3. Realistic Active Trade Proposals
    const swap1 = await SwapRequest.create({
      requester: alex._id,
      receiver: jordan._id,
      requestedItem: createdItems[1]._id,
      offeredItems: [createdItems[0]._id],
      status: 'PENDING',
      fairnessScore: 95,
      note: "Hey Rohan! Would love to swap my Nike Sports Hoodie for your Levi's 501 Jeans.",
    });

    const swap2 = await SwapRequest.create({
      requester: maya._id,
      receiver: admin._id,
      requestedItem: createdItems[4]._id,
      offeredItems: [createdItems[2]._id],
      status: 'ACCEPTED',
      fairnessScore: 98,
      note: 'Trading Zara Linen Shirt for the Uniqlo Light Down Jacket!',
    });

    // 4. Believable Chat Messages
    await ChatMessage.create({
      swapRequest: swap1._id,
      sender: alex._id,
      receiver: jordan._id,
      message: "Hi Rohan! I just proposed a swap for your Levi's 501 Jeans from Bangalore. Is the waist size true to fit?",
      read: true,
    });

    await ChatMessage.create({
      swapRequest: swap1._id,
      sender: jordan._id,
      receiver: alex._id,
      message: 'Hey Aarav! Yes, true to size 32x32. The Nike Sports Hoodie looks super clean too!',
      read: true,
    });

    await ChatMessage.create({
      swapRequest: swap1._id,
      sender: alex._id,
      receiver: jordan._id,
      message: 'Awesome! I can dispatch via BlueDart express tomorrow morning from Indiranagar.',
      read: false,
    });

    console.log('✅ Production database populated successfully with real Indian cities, brands, and active swapper history!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
