import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import fs from 'fs';
import { Types } from 'mongoose';
import multer from 'multer';
import path from 'path';

import Quest from '../models/questModel';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';
import {
  editUserCredentialsSchema,
  editUserDataSchema,
  editUserPasswordSchema,
  loginSchema,
  registerSchema,
} from '../validation/userValidationSchemas';

// Profile picture upload setup
const PROFILE_PICTURE_DIR = path.join(process.cwd(), 'public', 'uploads', 'profile-pictures');
fs.mkdirSync(PROFILE_PICTURE_DIR, { recursive: true });

const profilePictureStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PROFILE_PICTURE_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const profilePictureUpload = multer({
  storage: profilePictureStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function getUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ error: 'Missing userId parameter' });
    return;
  }
  
  try {
    const user = await User.findById(userId)
    .select('username firstName lastName profilePicture')
    .lean();
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function registerUser(req: Request, res: Response): Promise<void> {
  const parsedBody = registerSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }
  
  const { username, email, password, firstName, lastName, birthday, profilePicture } =
  parsedBody.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  
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
      password: hashedPassword,
      firstName,
      lastName,
      birthday,
      profilePicture,
    });
    
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
}

async function loginUser(req: Request, res: Response): Promise<void> {
  const parsedBody = loginSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }
  
  const { username, password } = parsedBody.data;
  
  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Password is incorrect' });
      return;
    }
    // everything has passed: login
    user.isCurrent = true;
    await user.save();
    
    const token = generateToken(user._id.toString());
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to login' });
  }
}

async function logoutUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ error: 'No user ID provided' });
    return;
  }

  try {
    const userToLogout = await User.findByIdAndUpdate(userId, { isCurrent: false }, { new: true });
    if (!userToLogout) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.clearCookie('token', { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'lax',
      path: '/',
    });
    res.status(200).json(userToLogout);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to logout' });
  }
}

//non-sensitive data only
//TODO make separate endpoint for porfile picture upload in sprint 2 (for now just selecting from 10 profile picture options)
async function editUserData(req: Request, res: Response): Promise<void> {
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
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    birthday?: Date;
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
    console.log(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function uploadProfilePicture(req: Request, res: Response): Promise<void> {
  const file = (req).file as Express.Multer.File | undefined;
  if (!file) {
    res.status(400).json({ error: 'No file' });
    return;
  }
  const absolute = `${req.protocol}://${req.get('host')}/uploads/profile-pictures/${file.filename}`;
  res.status(200).json({ url: absolute });
}

async function editUserCredentials(req: Request, res: Response): Promise<void> {
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

  if (username || email) {
    const [usernameTaken, emailTaken] = await Promise.all([
      username ? User.exists({ username, _id: { $ne: userId } }) : null,
      email ? User.exists({ email, _id: { $ne: userId } }) : null,
    ]);
    if (usernameTaken || emailTaken) {
      const propertiesTaken: ('username' | 'email')[] = [];
      if (usernameTaken) propertiesTaken.push('username');
      if (emailTaken) propertiesTaken.push('email');
      res.status(409).json({
        error: `${propertiesTaken.join(' and ')} already ${propertiesTaken.length === 1 ? 'exist' : 'exists'}`,
      });
      return;
    }
  }

  const credentialsToUpdate: {
    username?: string;
    email?: string;
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
    console.log(err);
    res.status(500).json({ error: 'Failed to update user credentials' });
  }
}

async function editUserPassword(req: Request, res: Response): Promise<void> {
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
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true },
    );
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update user password' });
  }
}

async function getMyQuests(req: Request, res: Response): Promise<void> {
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
    console.log(err);
    res.status(500).json({ error: 'Failed to get myQuests' });
  }
}

async function getMyQuest(req: Request, res: Response): Promise<void> {
  const { userId, questId } = req.params;
  if (!userId || !questId) {
    res.status(400).json({ error: 'Missing userId or questId parameter' });
    return;
  }

  try {
    const user = await User.findById(userId).select('myQuests');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    //check if quest is part of myQuests
    const questIndex = user.myQuests.findIndex((myQuest) => myQuest.quest.toString() === questId);

    if (questIndex === -1) {
      res.status(404).json({ error: 'No quest with that questId found for this user' });
      return;
    }

    if (req.query.populate === '1') {
      await user.populate('myQuests.quest');
    }

    res.status(200).json(user.myQuests[questIndex]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to get myQuests' });
  }
}

async function addToMyQuests(req: Request, res: Response): Promise<void> {
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
    const inMyQuests = userToUpdate.myQuests.some(
      (myQuest) => myQuest.quest.toString() === questId,
    );
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to add quest to myQuests' });
  }
}

async function removeFromMyQuests(req: Request, res: Response): Promise<void> {
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
    const questIndex = userToUpdate.myQuests.findIndex(
      (myQuest) => myQuest.quest.toString() === questId,
    );
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to remove quest from myQuests' });
  }
}

async function toggleFavoriteQuest(req: Request, res: Response): Promise<void> {
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

    const questToFavorite = userToUpdate.myQuests.find(
      (myQuest) => myQuest.quest.toString() === questId,
    );
    if (!questToFavorite) {
      res.status(404).json({ error: 'Quest not found in myQuests' });
      return;
    }

    //toggle
    questToFavorite.isFavorite = !questToFavorite.isFavorite;

    await userToUpdate.save();

    if (req.query.populate === '1') {
      await userToUpdate.populate('myQuests.quest');
    }

    res.status(200).json(userToUpdate.myQuests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to favorite quest from myQuests' });
  }
}

export {
  addToMyQuests,
  editUserCredentials,
  editUserData,
  editUserPassword,
  getMyQuest,
  getMyQuests,
  getUser,
  getUsers,
  loginUser,
  logoutUser,
  profilePictureUpload,
  registerUser,
  removeFromMyQuests,
  toggleFavoriteQuest,
  uploadProfilePicture,
};
