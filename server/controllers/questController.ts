import { Request, Response } from 'express';
import Quest from '../models/questModel';

async function getQuests (req: Request, res: Response): Promise<void> {
  try {
    const quests = await Quest.find({});
    res.status(200).json(quests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
}

async function getQuest (req: Request, res: Response): Promise<void> {
  const { userId: questId } = req.params;
  if (!questId) {
    res.status(400).json({ error: 'Missing questId parameter' });
    return;
  }
  
  try {
    const quest = await Quest.findById(questId);
    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }
    res.status(200).json(quest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quest' });
  }
}

export {
  getQuests,
  getQuest,
}