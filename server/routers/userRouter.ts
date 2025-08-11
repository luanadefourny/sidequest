import express, { Router } from 'express';
import { getUsers, registerUser, loginUser, getUser } from '../controllers/userController';

const router: Router = express.Router();

router.get('/users', getUsers); //get all users
router.get('/users/:userId', getUser); //user lookup

router.post('/users', registerUser); //TODO change with auth
router.post('/login', loginUser); //TODO change with auth

router.patch('/users/:userId', editUserNonSensitiveData);
router.patch('/users/:userId/credentials', editUserCredentials);
router.patch('/users/:userId/password', editUserPassword);

router.get('/users/:userId/favorites/quests?populate=0|1', getUserFavoriteQuests);
router.post('/users/:userId/favorites/:questId', addQuestToFavorites);
router.delete('/users/:userId/favorites/:questId', removeQuestFromFavorites);

router.get('/users/:userId/locations', getUserSavedLocations);
router.post('/users/:userId/locations', createUserSavedLocation);
router.patch('/users/:userId/locations/:label', editUserSavedLocation);
router.delete('/users/:userId/locations/:label', removeUserSavedLocation);

router.get('/users/:userId/follwers', getUserFollowers);
router.get('/users/:userId/follwing', getUserFollowing);
router.post('/users/:userId/follow', followUser);
router.delete('/users/:userId/follow', unfollowUser);

export default router;