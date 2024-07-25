import * as ProjectController from '../Controller/ProjectController';
import * as ValidateProject from '../Middleware/ValidateProject';
import * as ColumController from '../Controller/ColumController';
import * as ValidateColum from '../Middleware/ValidateColum';
import * as ValidateMember from '../Middleware/ValidateMember';
import * as MemberController from '../Controller/MemberController';
import express from 'express';
const router = express.Router();

router.post('/project', ...ValidateProject.validateCreate(), ProjectController.create);
router.put('/project/:project_id', ValidateProject.validateUpdate, ProjectController.edit);
router.delete('/project/:project_id', ProjectController.destroy);

router.post('/member', ValidateMember.addUser, MemberController.add);
router.delete('/member/:id', ValidateMember.moveUser, MemberController.remove);
router.put('/member/:id', MemberController.editRole);
router.get('/member', MemberController.show);

router.post('/colum', ...ValidateColum.validateCreate() ,ColumController.create);
router.put('/colum/:col_id', ...ValidateColum.validateUpdate() ,ColumController.edit);
router.delete('/colum/:col_id', ...ValidateColum.validateDelete(), ColumController.destroy);

export default router;
