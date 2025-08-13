import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from '../models/userModel';
import Quest from '../models/questModel';
import {
  registerSchema,
  loginSchema,
  editUserDataSchema,
  editUserCredentialsSchema,
  editUserPasswordSchema,
} from '../validation/userValidationSchemas';


async function getUsers (req: Request, res: Response): Promise<void> {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

async function getUser (req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ error: 'Missing userId parameter' });
    return;
  }

  try {
    const user = await User
      .findById(userId)
      .select('username firstName lastName profilePicture')
      .lean();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function registerUser (req: Request, res: Response): Promise<void> {
  const parsedBody = registerSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const { username, email, password, firstName, lastName, birthday } = parsedBody.data;

  try {
    // check that the username and email provided doesn't already belong to a user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const property = existingUser.username === username ? 'username' : 'email';
      res.status(400).json({ error: `${property} already exists` });
      return;
    }

    const newUser = await User.create({
      username,
      email,
      password, //TODO: hash
      firstName,
      lastName,
      birthday,
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
}

async function loginUser (req: Request, res: Response): Promise<void> {
  const parsedBody = loginSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const { username, password } = parsedBody.data;

  try {
    const user = await User.findOne({ username });
    if(!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    //TODO: change to bcrypt compare
    if (user.password !== password) {
      res.status(401).json({ error: 'Password is incorrect' });
      return;
    }
    // everything has passed: login
    user.isCurrent = true;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to login' });
  }
}

//non-sensitive data only
//TODO make separate endpoint for porfile picture upload in sprint 2 (for now just selecting from 10 profile picture options)
async function editUserData (req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ error: 'No user ID provided' });
    return;
  }

  const parsedBody = editUserDataSchema.safeParse(req.body);
  console.log(parsedBody);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const { firstName, lastName, profilePicture, birthday } = parsedBody.data;

  const dataToUpdate: {
    firstName?: string,
    lastName?: string,
    profilePicture?: string,
    birthday?: Date
  } = {};
  if (firstName !== undefined) dataToUpdate.firstName = firstName;
  if (lastName !== undefined) dataToUpdate.lastName = lastName;
  if (profilePicture !== undefined) dataToUpdate.profilePicture = profilePicture;
  if (birthday !== undefined) dataToUpdate.birthday = birthday;

  console.log(dataToUpdate);
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, { new: true });
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function editUserCredentials (req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ error: 'No user ID provided' });
    return;
  }

  const parsedBody = editUserCredentialsSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const { username, email } = parsedBody.data;

  const credentialsToUpdate: {
    username?: string,
    email?: string
  } = {};
  if (username !== undefined) credentialsToUpdate.username = username;
  if (email !== undefined) credentialsToUpdate.email = email;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, credentialsToUpdate, { new: true });
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user credentials' });
  }
}

async function editUserPassword (req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ error: 'No user ID provided' });
    return;
  }

  const parsedBody = editUserPasswordSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const { newPassword } = parsedBody.data;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user password' });
  }
}

async function getMyQuests (req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ error: 'Missing userId parameter' });
    return;
  }

  try {
    const user = await User.findById(userId).select('myQuests');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.myQuests || user.myQuests.length === 0) {
      res.status(404).json({ error: 'No quests found for this user' });
      return;
    }

    if (req.query.populate === '1') {
      await user.populate('myQuests.quest');
    }

    res.status(200).json(user.myQuests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get myQuests' });
  }
}

async function addToMyQuests (req: Request, res: Response): Promise<void> {
  const { userId, questId } = req.params;
  if (!userId || !questId) {
    res.status(400).json({ error: 'Missing userId or questId parameter' });
    return;
  }

  try {
    const quest = await Quest.findById(questId);
    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    //check if quest is already part of myQuests
    const inMyQuests = userToUpdate.myQuests.some(myQuest => myQuest.quest.toString() === questId)
    if (inMyQuests) {
      //TODO remove code repetition
      if (req.query.populate === '1') {
        await userToUpdate.populate('myQuests.quest');
      }
      res.status(200).json(userToUpdate.myQuests);
      return;
    }

    userToUpdate.myQuests.push({
      quest: new Types.ObjectId(questId),
      isFavorite: false,
    });

    await userToUpdate.save();
    if (req.query.populate === '1') {
      await userToUpdate.populate('myQuests.quest');
    }

    res.status(201).json(userToUpdate.myQuests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add quest to myQuests' });
  }
}

async function removeFromMyQuests (req: Request, res: Response): Promise<void> {
  const { userId, questId } = req.params;
  if (!userId || !questId) {
    res.status(400).json({ error: 'Missing userId or questId parameter' });
    return;
  }

  try {
    //TODO what if a quest disappears from api but is still saved to a user?
    // const quest = await Quest.findById(questId);
    // if (!quest) {
    //   res.status(404).json({ error: 'Quest not found' });
    //   return;
    // }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    //check if quest is part of myQuests
    const questIndex = userToUpdate.myQuests.findIndex(myQuest => myQuest.quest.toString() === questId)
    //nothing to remove
    if (questIndex === -1) {
      res.status(204).send();
      return;
    }
    //remove quest
    userToUpdate.myQuests.splice(questIndex, 1);
    await userToUpdate.save();

    if (req.query.populate === '1') {
      await userToUpdate.populate('myQuests.quest');
    }

    res.status(200).json(userToUpdate.myQuests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove quest from myQuests' });
  }
}

async function toggleFavoriteQuest (req: Request, res: Response): Promise<void> {
  const { userId, questId } = req.params;
  if (!userId || !questId) {
    res.status(400).json({ error: 'Missing userId or questId parameter' });
    return;
  }

  try {
    //TODO what if a quest disappears from api but is still saved to a user?
    // const quest = await Quest.findById(questId);
    // if (!quest) {
    //   res.status(404).json({ error: 'Quest not found' });
    //   return;
    // }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const questToFavorite = userToUpdate.myQuests.find(myQuest => myQuest.quest.toString() === questId);
    if (!questToFavorite) {
      res.status(404).json({ error: 'Quest not found in myQuests' });
      return;
    }

    //toggle
    questToFavorite.isFavorite = !questToFavorite.isFavorite;

    await userToUpdate.save()

    if (req.query.populate === '1') {
      await userToUpdate.populate('myQuests.quest');
    }

    res.status(200).json(userToUpdate.myQuests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to favorite quest from myQuests' });
  }
}

export {
  getUsers,
  registerUser,
  loginUser,
  getUser,
  editUserData,
  editUserCredentials,
  editUserPassword,
  getMyQuests,
  addToMyQuests,
  removeFromMyQuests,
  toggleFavoriteQuest,
};