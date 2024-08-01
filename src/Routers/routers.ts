import * as ProjectController from '../Controller/ProjectController';
import * as ValidateProject from '../Middleware/ValidateProject';
import * as ColumController from '../Controller/ColumController';
import * as ValidateColum from '../Middleware/ValidateColum';
import * as ValidateMember from '../Middleware/ValidateMember';
import * as MemberController from '../Controller/MemberController';
import * as RoleController from '../Controller/RoleController';
import * as authenticator from '../Middleware/UserAuthenticator';
import * as ProjectAut from '../Middleware/ProjectAuthenticator';
import * as TaskAut from '../Middleware/TaskAuthenticator';
import * as CommentAut from '../Middleware/CommentAuthenticator';
import * as user from '../Controller/UserController';
import * as validateRole from '../Middleware/ValidateRole';
import * as task from '../Controller/TaskController';
import { validateTask } from '../Middleware/TaskValidator';
import * as userValidator from '../Middleware/UserValidator';
import * as comment from '../Controller/CommentControllers';
import express from 'express';
const router = express.Router();

router.post(
  '/project',
  authenticator.verifyToken,
  ...ValidateProject.validateCreate(),
  ProjectController.create,
);
router.put(
  '/project/:project_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(1),
  ...ValidateProject.validateUpdate(),
  ProjectController.edit,
);
router.delete(
  '/project/:project_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ProjectController.destroy,
);

router.get('/project/member/:project_id', MemberController.show);

router.post(
  '/member',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(3),
  ...ValidateMember.addUser(),
  MemberController.add,
);
router.delete(
  '/member/:member_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(4),
  MemberController.remove,
);
router.put(
  '/member/:member_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(2),
  MemberController.editRole,
);

router.post(
  '/project/role',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(5),
  ...validateRole.validateRole(),
  RoleController.create,
);

router.put(
  '/change_owner',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateChangeOwnerProject(),
  RoleController.changeProjectOwner,
);

router.put(
  '/project/role/:role_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(6),
  ...validateRole.validateRole(),
  RoleController.edit,
);

router.delete(
  '/project/role/:role_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(7),
  ...validateRole.validateDelete(),
  RoleController.destroy,
);

router.post(
  '/colum',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(13),
  ...ValidateColum.validateCreate(),
  ColumController.create,
);
router.put(
  '/colum/:col_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(14),
  ...ValidateColum.validateUpdate(),
  ColumController.edit,
);
router.delete(
  '/colum/:col_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(15),
  ...ValidateColum.validateDelete(),
  ColumController.destroy,
);

router.post('/login', user.getLogin);
router.post(
  '/register',
  ...userValidator.validateRegister(),
  user.postRegister,
);
router.delete('/user/:userId', user.deleteUser);

router.post(
  '/task',
  authenticator.verifyToken,
  TaskAut.authenticateCDTask(8),
  ...validateTask(),
  task.generateTask,
);
router.get(
  '/task/:id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(11),
  task.getTask,
);
router.get('/task', task.getTasks);
router.delete(
  '/task/:id',
  authenticator.verifyToken,
  TaskAut.authenticateCDTask(10),
  task.deleteTask,
);
router.put(
  '/task/:id',
  authenticator.verifyToken,
  TaskAut.authenticateUpdateTask(9),
  task.update,
);

router.post(
  '/comment',
  authenticator.verifyToken,
  CommentAut.authenticateCreateComment(12),
  comment.generate,
);
router.put(
  '/comment',
  authenticator.verifyToken,
  CommentAut.authenticateUpdateComment,
  comment.update,
);
router.post(
  '/reply',
  authenticator.verifyToken,
  CommentAut.authenticateCreateComment(12),
  comment.reply,
);
router.delete(
  '/comment/:key',
  authenticator.verifyToken,
  CommentAut.authenticateDeleteComment,
  comment.destroy,
);

export default router;
