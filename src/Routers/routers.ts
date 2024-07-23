import * as ProjectController from '../Controller/ProjectController';
import * as ValidateProject from '../Middleware/ValidateProject';
import * as ColumController from '../Controller/ColumController';
import * as ValidateColum from '../Middleware/ValidateColum';
import express from 'express';
const router = express.Router();

router.post('/project', ValidateProject.validate,ProjectController.Create);
router.put('/project/:projectid', ProjectController.Edit);
router.delete('/project/:projectid', ProjectController.Delete);

router.post('/member/:projectid', add_member);
router.delete('/member/:projectid', remove_member);
router.put('/member/:projectid', edit_member_role);
router.get('/member/:projectid', show_member);

router.post('/colum/:projectid', ColumController.create);
router.put('/colum/:projectid', ColumController.edit);
router.delete('/colum/:col_id', ColumController.d);
router.put('/task/:col_id', move_task)
export default router;
