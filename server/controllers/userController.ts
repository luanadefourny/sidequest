import { Request, Response } from 'express';
import User from '../models/userModel';

async function getAllUsers (request: Request, response: Response): Promise<void> {
  try {
    const data = await User.find({});
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send('For debugging - Error at getAllUsers: ').send(error);
  }
};

async function createUser (request: Request, response: Response): Promise<void> {
  const input  = request.body;

  if (!input.username || typeof input.username !== 'string') {
    response.status(400).send('Bad Request, Name is required, must be a string and different from existing entries');
    return;
  }
  
  try {
    const existingUser = await User.findOne({ username: input.username });

    let user;
    if (existingUser) {
      //login existing user
      const updatedUser = await User.findOneAndUpdate(
        { username: input.username },
        { $set: { isCurrent: true } },
        { new: true }
      );
      user = updatedUser;
    } else {
      //register user as new and login
      const newUser = await User.create({
        username: input.username,
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
        age: input.age,
        isCurrent: true,
      })
      user = newUser;
    }

    response.status(201).json(user);
  } catch (error) {
    console.error(error);
    response.status(400).send('Something went wrong while creating the user. It might already exist in the DB.');
  }
};

export { getAllUsers, createUser };