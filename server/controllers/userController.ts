import { Request, Response } from 'express';
import User from '../models/userModel';

async function getAllUsers (request: Request, response: Response): Promise<void> {
  try {
    const data = await User.find({});
    response.status(200).send(data);
  } catch (error) {
    response.status(400).json(error);
  }
};

async function createUser (request: Request, response: Response): Promise<void> {
  const { username, email, password, firstName, lastName, age }  = request.body;

  //TODO: need more checks for password, username, email

  if (!username || typeof username !== 'string') {
    response.status(400).send('Name is required, must be a string and different from existing entries');
    return;
  }
  
  try {
    const existingUser = await User.findOne({ username });

    let user;
    if (existingUser) {
      //login existing user
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $set: { isCurrent: true } },
        { new: true }
      );
      user = updatedUser;
    } else {
      //register user as new and login
      const newUser = await User.create({
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        age: age,
        isCurrent: true,
      })
      user = newUser;
    }

    response.status(201).json(user);
  } catch (error) {
    console.error(error);
    response.status(400).json(error);
  }
};

export { getAllUsers, createUser };