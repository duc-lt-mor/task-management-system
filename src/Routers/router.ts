import {
  create_project,
  edit_project,
  delete_project,
  add_member,
  remove_member, 
  edit_member_role,
  show_member
} from '../Controller/projectController';
import express from 'express';
const router = express.Router();

router.post('/project', create_project);
router.put('/project/:projectid', edit_project);
router.delete('/project/:projectid', delete_project);
router.post('/member/:projectid', add_member);
router.delete('/member/:projectid', remove_member);
router.put('/member/:projectid', edit_member_role);
router.get('/member/:projectid', show_member)
export default router;
