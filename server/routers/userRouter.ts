import express, { Router } from 'express';
import { 
  getUsers, 
  registerUser, 
  loginUser, 
  getUser, 
  editUserData, 
  editUserCredentials,
  editUserPassword,
  getMyQuests,
  getMyQuest,
  addToMyQuests,
  removeFromMyQuests,
  toggleFavoriteQuest,
} from '../controllers/userController';

const router: Router = express.Router();

router.get('/users', getUsers); //get all users
router.get('/users/:userId', getUser); //user lookup

router.post('/users', registerUser); //TODO change with auth
router.post('/login', loginUser); //TODO change with auth

router.patch('/users/:userId', editUserData);
router.patch('/users/:userId/credentials', editUserCredentials);
router.patch('/users/:userId/password', editUserPassword);

//! all following endpoints have this: ?populate=0|1 to the end to decide whether to populate results or not
router.get('/users/:userId/my-quests', getMyQuests);
router.get('/users/:userId/my-quests/:questId', getMyQuest);
router.post('/users/:userId/my-quests/:questId', addToMyQuests);
router.delete('/users/:userId/my-quests/:questId', removeFromMyQuests);
router.patch('/users/:userId/my-quests/:questId/favorite', toggleFavoriteQuest);

// router.get('/users/:userId/locations', getMyLocations);
// router.post('/users/:userId/locations', addToMyLocation);
// router.patch('/users/:userId/locations/:label', editMyLocation);
// router.delete('/users/:userId/locations/:label', removeFromMyLocation);

// router.get('/users/:userId/follwers', getUserFollowers);
// router.get('/users/:userId/follwing', getUserFollowing);
// router.post('/users/:userId/follow', followUser);
// router.delete('/users/:userId/follow', unfollowUser);

export default router;