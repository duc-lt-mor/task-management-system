import * as ProjectController from '../Controller/ProjectController';
import * as ValidateProject from '../Middleware/ValidateProject';
import * as ColumController from '../Controller/ColumController';
import * as ValidateColum from '../Middleware/ValidateColum';
import * as ValidateMember from '../Middleware/ValidateMember';
import * as MemberController from '../Controller/MemberController';
import * as authenticator from '../Middleware/UserAuthenticator';
import * as ProjectAut from '../Middleware/ProjectAuthenticator';
import * as user from "../Controller/UserController"
import * as validator from "../Middleware/UserValidator"
import { exceptionHandler } from "../Middleware/ExceptionHandler"
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
  ProjectAut.authenticateProject,
  ...ValidateProject.validateUpdate(),
  ProjectController.edit,
);
router.delete(
  '/project/:project_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject,
  ProjectController.destroy,
);

router.get('/project/member/:project_id', MemberController.show);

router.post(
  '/member',
  authenticator.verifyToken,
  ProjectAut.authenticateProject,
  ...ValidateMember.addUser(),
  MemberController.add,
);
router.delete(
  '/member/:id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject,
  MemberController.remove,
);
router.put(
  '/member/:id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject,
  MemberController.editRole,
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



router.post('/login', user.getLogin)
router.post('/register', ...validator.validateRegister(), user.postRegister)
router.delete('/user/:userId', user.deleteUser)

export default router;
