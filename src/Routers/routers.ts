import * as ProjectController from '../Controller/ProjectController';
import * as ValidateProject from '../Middleware/ValidateProject';
import * as ColumController from '../Controller/ColumController';
import * as ValidateColum from '../Middleware/ValidateColum';
import * as ValidateMember from '../Middleware/ValidateMember';
import * as MemberController from '../Controller/MemberController';
import * as RoleController from '../Controller/RoleController';
import * as authenticator from '../Middleware/UserAuthenticator';
import * as ProjectAut from '../Middleware/ProjectAuthenticator';
import * as user from '../Controller/UserController';
import * as validator from '../Middleware/UserValidator';
import express from 'express';
const router = express.Router();

router.post(
  '/project',
  ...ValidateProject.validateCreate(),
  ProjectController.create,
);
router.put(
  '/project/:project_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(3),
  ...ValidateProject.validateUpdate(),
  ProjectController.edit,
);
router.delete(
  '/project/:project_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(4),
  ProjectController.destroy,
);

router.get('/project/member/:project_id', MemberController.show);

router.post(
  '/member',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(5),
  ...ValidateMember.addUser(),
  MemberController.add,
);
router.delete(
  '/member/:id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(6),
  MemberController.remove,
);
router.put(
  '/member/:id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(3),
  MemberController.editRole,
);

router.post(
  '/project/role',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(1),
  RoleController.create,
);

router.put(
  '/project/role/:role_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(3),
  RoleController.edit,
);

router.post(
  '/colum',
  authenticator.verifyToken,
  ProjectAut.authenticateProject,
  ...ValidateColum.validateCreate(),
  ColumController.create,
);
router.put(
  '/colum/:col_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject,
  ...ValidateColum.validateUpdate(),
  ColumController.edit,
);
router.delete(
  '/colum/:col_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject,
  ...ValidateColum.validateDelete(),
  ColumController.destroy,
);

router.post('/login', user.getLogin);
router.post('/register', ...validator.validateRegister(), user.postRegister);
router.delete('/user/:userId', user.deleteUser);

export default router;
