import * as ProjectController from '../Controller/ProjectController';
import * as ValidateProject from '../Middleware/ValidateProject';
import * as ColumController from '../Controller/ColumController';
import * as ValidateColum from '../Middleware/ValidateColum';
import * as ValidateMember from '../Middleware/ValidateMember';
import * as MemberController from '../Controller/MemberController';
import express from 'express';
const router = express.Router();

router.post('/project', ValidateProject.create, ProjectController.Create);
router.put(
  '/project/:project_id',
  ValidateProject.update,
  ProjectController.Edit,
);
router.delete('/project/:project_id', ProjectController.Delete);

router.post('/member', ValidateMember.validate_add_user, MemberController.Add);
router.delete('/member/:id', MemberController.Remove);
router.put('/member/:id', MemberController.EditRole);
router.get('/member/:id', MemberController.Show);

router.post('/colum/:col_id', ColumController.Create);
router.put('/colum/:col_id', ColumController.Edit);
router.delete('/colum/:col_id', ColumController.Delete);
router.put('/task/:col_id', ColumController.MoveTask);
export default router;
