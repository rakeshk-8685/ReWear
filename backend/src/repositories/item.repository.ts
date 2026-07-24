import { Item, IItem } from '../models/Item';

export interface IItemFilterOptions {
  search?: string;
  category?: string;
  condition?: string;
  gender?: string;
  size?: string;
  brand?: string;
  minValue?: number;
  maxValue?: number;
  status?: string;
  location?: string;
  ownerId?: string;
  excludeOwnerId?: string;
}

export class ItemRepository {
  async findById(id: string): Promise<IItem | null> {
    return Item.findById(id).populate('owner', 'name avatarUrl ratingAverage ratingCount swapCount location');
  }

  async countAll(): Promise<number> {
    return Item.countDocuments();
  }

  async create(itemData: Partial<IItem>): Promise<IItem> {
    const item = new Item(itemData);
    return item.save();
  }

  async update(id: string, updateData: Partial<IItem>): Promise<IItem | null> {
    return Item.findByIdAndUpdate(id, updateData, { new: true }).populate(
      'owner',
      'name avatarUrl ratingAverage ratingCount'
    );
  }

  async delete(id: string): Promise<boolean> {
    const res = await Item.findByIdAndDelete(id);
    return !!res;
  }

  async findFiltered(
    options: IItemFilterOptions,
    skip: number = 0,
    limit: number = 20
  ): Promise<{ items: IItem[]; total: number }> {
    const query: any = {};

    if (options.status && options.status !== 'ALL') {
      query.status = { $regex: new RegExp(options.status, 'i') };
    }

    if (options.category && options.category !== 'All' && options.category !== 'All Items') {
      query.category = { $regex: new RegExp(options.category, 'i') };
    }

    if (options.condition && options.condition !== 'ALL') {
      query.condition = { $regex: new RegExp(options.condition, 'i') };
    }

    if (options.gender && options.gender !== 'ALL') {
      query.gender = { $regex: new RegExp(options.gender, 'i') };
    }

    if (options.size) {
      query.size = options.size;
    }

    if (options.brand) {
      query.brand = { $regex: options.brand, $options: 'i' };
    }

    if (options.minValue !== undefined || options.maxValue !== undefined) {
      query.valueEstimate = {};
      if (options.minValue !== undefined) query.valueEstimate.$gte = options.minValue;
      if (options.maxValue !== undefined) query.valueEstimate.$lte = options.maxValue;
    }

    if (options.location && options.location !== 'ALL') {
      query.location = { $regex: options.location, $options: 'i' };
    }

    if (options.ownerId) {
      query.owner = options.ownerId;
    }

    if (options.excludeOwnerId) {
      query.owner = { $ne: options.excludeOwnerId };
    }

    if (options.search) {
      query.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { description: { $regex: options.search, $options: 'i' } },
        { brand: { $regex: options.search, $options: 'i' } },
        { location: { $regex: options.search, $options: 'i' } },
        { tags: { $in: [new RegExp(options.search, 'i')] } },
      ];
    }

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('owner', 'name avatarUrl ratingAverage ratingCount location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { items, total };
  }

  async toggleLike(itemId: string, userId: string): Promise<{ item: IItem | null; liked: boolean }> {
    const item = await Item.findById(itemId);
    if (!item) return { item: null, liked: false };

    const likedIndex = item.likedBy.findIndex((id) => id.toString() === userId);
    let liked = false;

    if (likedIndex > -1) {
      item.likedBy.splice(likedIndex, 1);
      item.likesCount = Math.max(0, item.likesCount - 1);
    } else {
      item.likedBy.push(userId as any);
      item.likesCount += 1;
      liked = true;
    }

    await item.save();
    return { item, liked };
  }

  async incrementViews(itemId: string): Promise<void> {
    await Item.findByIdAndUpdate(itemId, { $inc: { viewsCount: 1 } });
  }

  async updateStatusMany(itemIds: string[], status: string): Promise<void> {
    await Item.updateMany({ _id: { $in: itemIds } }, { status });
  }
}

export const itemRepository = new ItemRepository();
