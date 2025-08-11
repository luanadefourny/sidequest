import { Request, Response } from 'express';
import User from '../models/userModel';
import { registerSchema, loginSchema } from '../validation/userSchemas';

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
    res.status(400).json({ error: 'No user ID provided' });
    return;
  }
  
  try {
    const user = await User.findById(userId);
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

export { getUsers, registerUser, loginUser };