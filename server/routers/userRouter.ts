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
  getUsers,
  loginUser,
  logoutUser,
  profilePictureUpload,
  registerUser,
  removeFromMyQuests,
  toggleFavoriteQuest,
  unfollowUser,
  uploadProfilePicture,
} from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/users', getUsers); //get all users
router.get('/users/:userId', getUser); //user lookup

router.post('/users', registerUser); //TODO change with auth
router.post('/login', loginUser); //TODO change with auth
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
router.get('/users/:userId/my-quests/:questId', authenticateJWT, getMyQuest);
router.post('/users/:userId/my-quests/:questId', authenticateJWT, addToMyQuests);
router.delete('/users/:userId/my-quests/:questId', authenticateJWT, removeFromMyQuests);
router.patch('/users/:userId/my-quests/:questId/favorite', authenticateJWT, toggleFavoriteQuest);

// router.get('/users/:userId/locations', getMyLocations);
// router.post('/users/:userId/locations', addToMyLocation);
// router.patch('/users/:userId/locations/:label', editMyLocation);
// router.delete('/users/:userId/locations/:label', removeFromMyLocation);

// router.get('/users/:userId/follwers', getUserFollowers);
// router.get('/users/:userId/follwing', getUserFollowing);
router.post('/users/:targetUserId/follow', authenticateJWT, followUser);
router.delete('/users/:targetUserId/follow', authenticateJWT, unfollowUser);

export default router;
