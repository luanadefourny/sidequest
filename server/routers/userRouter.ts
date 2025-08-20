import express, { Router } from 'express';

import {
  addToMyQuests,
  editUserCredentials,
  editUserData,
  editUserPassword,
  followUser,
  getMyQuest,
  getMyQuests,
  getUser,
  getUserByUsername,
  getUsers,
  loginUser,
  logoutUser,
  profilePictureUpload,
  registerUser,
  removeFromMyQuests,
  toggleFavoriteQuest,
  unfollowUser,
  uploadProfilePicture
} from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/users', getUsers); //get all users
router.get('/users/:userId', getUser); //user
router.get('/users/by-username/:username', getUserByUsername);

router.post('/users', registerUser);
router.post('/login', loginUser); 
router.patch('/users/:userId/logout', logoutUser);

router.patch('/users/:userId', authenticateJWT, editUserData);
router.post(
  '/uploads/profile-picture',
  authenticateJWT,
  profilePictureUpload.single('file'),
  uploadProfilePicture,
);
router.patch('/users/:userId/credentials', authenticateJWT, editUserCredentials);
router.patch('/users/:userId/password', authenticateJWT, editUserPassword);

//! all following endpoints have this: ?populate=0|1 to the end to decide whether to populate results or not
router.get('/users/:userId/my-quests', authenticateJWT, getMyQuests);
router.get('/users/:userId/my-quests/:questId', authenticateJWT, getMyQuest); //questId = clientId
router.post('/users/:userId/my-quests', authenticateJWT, addToMyQuests); //body = quest object
router.delete('/users/:userId/my-quests/:questId', authenticateJWT, removeFromMyQuests); //questId = clientId
router.patch('/users/:userId/my-quests/:questId/favorite', authenticateJWT, toggleFavoriteQuest); //questId = clientId

// router.get('/users/:userId/locations', getMyLocations);
// router.post('/users/:userId/locations', addToMyLocation);
// router.patch('/users/:userId/locations/:label', editMyLocation);
// router.delete('/users/:userId/locations/:label', removeFromMyLocation);

// router.get('/users/:userId/follwers', getUserFollowers);
// router.get('/users/:userId/follwing', getUserFollowing);
router.post('/users/:targetUserId/follow', authenticateJWT, followUser);
router.delete('/users/:targetUserId/follow', authenticateJWT, unfollowUser);

export default router;
