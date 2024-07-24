import * as ProjectController from '../Controller/ProjectController';
import * as ValidateProject from '../Middleware/ValidateProject';
import * as ColumController from '../Controller/ColumController';
import * as ValidateColum from '../Middleware/ValidateColum';
import * as ValidateMember from '../Middleware/ValidateMember';
import * as MemberController from '../Controller/MemberController';
import express from 'express';
const router = express.Router();

router.post('/project', ValidateProject.validate_create, ProjectController.Create);
router.put('/project/:project_id', ValidateProject.validate_update, ProjectController.Edit);
router.delete('/project/:project_id', ProjectController.Delete);

router.post('/member', ValidateMember.add_user, MemberController.Add);
router.delete('/member/:id', ValidateMember.move_user, MemberController.Remove);
router.put('/member/:id', MemberController.EditRole);
router.get('/member', MemberController.Show);

router.post('/colum', ValidateColum.validate_create ,ColumController.Create);
router.put('/colum/:col_id', ValidateColum.validate_update ,ColumController.Edit);
router.delete('/colum/:col_id', ValidateColum.validate_delete, ColumController.Delete);

export default router;
