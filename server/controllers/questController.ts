import { Request, Response } from 'express';
import Quest from 'models/questModel';
import { Types } from 'mongoose';

async function getQuests (req: Request, res: Response): Promise<void> {
  try {
    const quests = await Quest.find({});
    res.status(200).json(quests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
}

export {
  getQuests,
}