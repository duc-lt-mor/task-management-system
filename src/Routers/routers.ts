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
import * as search from '../Controller/KeywordController';
import { validateTask } from '../Middleware/TaskValidator';
import * as userValidator from '../Middleware/UserValidator';
import * as comment from '../Controller/CommentControllers';
import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /project:
 *    post:
 *       summary: Create a project
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: project 1
 *                 key:
 *                   type: string
 *                   example: proj1
 *                 decripstion:
 *                   type: string
 *                   example: this is decripstion of project 1
 *                 expected_end_date:
 *                   type: string
 *                   format: date
 *                   example: '2024-08-09'
 *               required:
 *                 - name
 *                 - key
 *                 - expected_end_date
 *       responses:
 *         '200':
 *           description: OK
 *         '500':
 *           description: Internal Server Error
 */
router.post(
  '/project',
  authenticator.verifyToken,
  ...ValidateProject.validateCreate(),
  ProjectController.create,
);

/**
 * @swagger
 * /project/{project_id}:
 *    put:
 *       summary: Update a project
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: project_id
 *           in: path
 *           type: string
 *           required: true
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: project 1
 *                 decripstion:
 *                   type: string
 *                   example: this is decripstion of project 1
 *                 expected_end_date:
 *                   type: string
 *                   format: date
 *                   example: '2024-08-09'
 *                 real_end_date:
 *                   type: string
 *                   format: date
 *                   example: '2024-08-09'
 *               required:
 *                 - name
 *                 - expected_end_date
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.put(
  '/project/:project_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...ValidateProject.validateUpdate(),
  ProjectController.edit,
);

/**
 * @swagger
 * /project/{project_id}:
 *    delete:
 *       summary: Delete a project
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: project_id
 *           in: path
 *           type: string
 *           required: true
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.delete(
  '/project/:project_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ProjectController.destroy,
);

/**
 * @swagger
 * /showMember/{project_id}:
 *    get:
 *       summary: Return a list member of a project
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: project_id
 *           in: path
 *           type: string
 *           required: true
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.get(
<<<<<<< HEAD
  '/project/member/:project_id',
=======
  '/showMember/:project_id',
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
  authenticator.verifyToken,
  ProjectAut.authenticateProject(5),
  MemberController.show,
);

/**
 * @swagger
 * /showRole/{project_id}:
 *    get:
 *       summary: Show roles of a project
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: project_id
 *           in: path
 *           type: string
 *           required: true
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.get(
<<<<<<< HEAD
  '/showrole/:project_id',
=======
  '/showRole/:project_id',
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
  authenticator.verifyToken,
  ProjectAut.authenticateProject(1),
  RoleController.showRole,
);

/**
 * @swagger
 * /member:
 *    post:
 *       summary: Add a user to a project
 *       tags:
 *         - Member
<<<<<<< HEAD
 *       parameters:
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *                 example: 1
 *               project_role_id:
 *                 type: string
 *                 example: 1
 *               add_mem:
 *                 type: string
 *                 example: 'user name/email'
=======
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: string
 *                   example: 1
 *                 project_role_id:
 *                   type: string
 *                   example: this is decripstion of project 1
 *                 add_mem:
 *                   type: string
 *                   example: abc@gmail.com
 *               required:
 *                 - project_id
 *                 - project_role_id
 *                 - add_mem
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.post(
  '/member',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(3),
  ...ValidateMember.addUser(),
  MemberController.add,
);

/**
 * @swagger
 * /member/{member_id}:
 *    delete:
 *       summary: Remove a user from project
 *       tags:
 *         - Member
 *       parameters:
 *         - name: member_id
 *           in: path
 *           type: string
 *           required: true
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: string
 *                   example: 1
 *               required:
 *                 - project_id
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.delete(
  '/member/:member_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(4),
  MemberController.remove,
);

/**
 * @swagger
 * /member/{member_id}:
 *    put:
 *       summary: Edit role of a user in a project
 *       tags:
 *         - Member
 *       parameters:
 *         - name: member_id
 *           in: path
 *           type: string
 *           required: true
<<<<<<< HEAD
 *         - name: authorization
 *           in: header
 *           type: string
 *           expamle: Bearer
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               project_role_id:
 *                 type: string
 *                 example: 1
 *               project_id:
 *                 type: string
 *                 example: 1
=======
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: string
 *                   example: 1
 *                 project_role_id:
 *                   type: string
 *                   example: this is decripstion of project 1
 *               required:
 *                 - project_id
 *                 - project_role_id
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.put(
  '/member/:member_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(2),
  MemberController.editRole,
);

/**
 * @swagger
<<<<<<< HEAD
 * /change_owner:
 *    put:
 *       summary: Change owner of a project
 *       tags:
 *         - Project
=======
 * /member/{member_id}:
 *    get:
 *       summary: Find a user from project
 *       tags:
 *         - Member
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       parameters:
 *         - name: member_id
 *           in: path
 *           type: string
<<<<<<< HEAD
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               new_owner_id:
 *                 type: string
 *                 example: 1
 *               project_id:
 *                 type: string
 *                 example: 1
 *               new_project_role_id:
 *                 type: string
 *                 example: 1
=======
 *           required: true
 *       security:
 *         - bearerAuth: []
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
<<<<<<< HEAD
router.put(
  '/change_owner',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateChangeOwnerProject(),
  RoleController.changeProjectOwner,
=======
router.get(
  '/member/:member_id',
  authenticator.verifyToken,
  MemberController.findById,
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
);

/**
 * @swagger
 * /project/role:
 *    post:
 *       summary: Create a role
 *       tags:
<<<<<<< HEAD
 *         - Role
 *       parameters:
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: role 1
 *               project_id:
 *                 type: string
 *                 example: 1
 *               permissions:
 *                 type: array
 *                 example: [8,9,10,11]
=======
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: string
 *                   example: project 1
 *                 new_project_role_id:
 *                   type: string
 *                   example: this is decripstion of project 1
 *                 new_owner_id:
 *                   type: string
 *                   example: 1
 *               required:
 *                 - project_id
 *                 - new_project_role_id
 *                 - new_owner_id
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.post(
  '/project/role',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateRole(),
  RoleController.create,
);

/**
 * @swagger
 * /role:
 *    post:
 *       summary: Create a role
 *       tags:
 *         - Role
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: project 1
 *                 project_id:
 *                   type: string
 *                   example: 1
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [8,9,10,11]
 *               required:
 *                 - name
 *                 - project_id
 *                 - permissions
 *       responses:
 *         '200':
 *           description: OK
 *         '500':
 *           description: Internal Server Error
 */
router.post(
  '/role',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateRole(),
  RoleController.create,
);

/**
 * @swagger
 * /role/{role_id}:
 *    put:
 *       summary: Update a role
 *       tags:
 *         - Role
 *       parameters:
 *         - name: role_id
 *           in: path
 *           type: string
 *           required: true
<<<<<<< HEAD
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: role 1
 *               permissions:
 *                 type: array
 *                 example: [9,8,10]
 *               project_id:
 *                 type: string
 *                 example: 1
=======
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: project 1
 *                 project_id:
 *                   type: string
 *                   example: 1
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [8,9,10,11]
 *               required:
 *                 - name
 *                 - project_id
 *                 - permissions
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.put(
  '/role/:role_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateRole(),
  RoleController.edit,
);

/**
 * @swagger
 * /role/{role_id}:
 *    delete:
 *       summary: Delete a role
 *       tags:
 *         - Role
 *       parameters:
 *         - name: role_id
 *           in: path
 *           type: string
 *           required: true
<<<<<<< HEAD
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *                 example: 1
=======
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: string
 *                   example: 1
 *               required:
 *                 - project_id
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.delete(
  '/role/:role_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateDelete(),
  RoleController.destroy,
);

/**
 * @swagger
 * /colum:
 *    post:
 *       summary: Create a colum in a project
 *       tags:
 *         - Colum
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: string
 *                   example: project 1
 *                 col_type:
 *                   type: string
 *                   enum:
 *                     - todo
 *                     - in_progress
 *                     - done
 *                     - custom
 *                 name:
 *                   type: string
 *                   example: col 1
 *               required:
 *                 - project_id
 *                 - col_type
 *                 - name
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.post(
  '/colum',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(13),
  ...ValidateColum.validateCreate(),
  ColumController.create,
);

/**
 * @swagger
 * /colum/{col_id}:
 *    put:
 *       summary: Update a colum in a project
 *       tags:
 *         - Colum
 *       parameters:
 *         - name: col_id
 *           in: path
 *           type: string
 *           required: true
<<<<<<< HEAD
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: colum 1
 *               col_type:
 *                 type: string
 *                 example: todo/in_progress/done/custom
 *               array_index:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: interger
 *                     index:
 *                       type: interger
 *                 example: [{"id":9, "index":2},{"id":9, "index":2},{"id":9, "index":2},{"id":9, "index":2}]
=======
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: string
 *                   example: project 1
 *                 col_type:
 *                   type: string
 *                   enum:
 *                     - todo
 *                     - in_progress
 *                     - done
 *                     - custom
 *                 name:
 *                   type: string
 *                   example: col 1
 *                 array_index:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: interger
 *                       index:
 *                         type: interger
 *                   example: [{"id":9, "index":2},{"id":9, "index":2},{"id":9, "index":2},{"id":9, "index":2}]
 *               required:
 *                 - project_id
 *                 - col_type
 *                 - name
 *                 - array_index
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.put(
  '/colum/:col_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(14),
  ...ValidateColum.validateUpdate(),
  ColumController.edit,
);

/**
 * @swagger
 * /colum/{col_id}:
 *    delete:
 *       summary: Delete a colum in a project
 *       tags:
 *         - Colum
 *       parameters:
 *         - name: col_id
 *           in: path
 *           type: string
 *           required: true
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: string
 *                   example: 1
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.delete(
  '/colum/:col_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(15),
  ...ValidateColum.validateDelete(),
  ColumController.destroy,
);

/**
 * @swagger
 * /login:
 *    post:
 *       summary: Login
 *       tags:
 *         - User
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: any@gmail.com
 *                 password:
 *                   type: string
 *                   example: password
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.post('/login', user.getLogin);

/**
 * @swagger
 * /register:
 *    post:
 *       summary: Register
 *       tags:
 *         - User
 *       requestBody:
 *         require: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: john sena
 *                 email:
 *                   type: string
 *                   example: any@gmail.com
 *                 password:
 *                   type: string
 *                   example: password
 *                 passwordConfirm:
 *                   type: string
 *                   example: password
 *                 phone_number:
 *                   type: string
 *                   example: 123456
 *                 system_role_id:
 *                   type: string
 *                   example: 2
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.post(
  '/register',
  ...userValidator.validateRegister(),
  user.postRegister,
);

/**
 * @swagger
 * /user/{userId}:
 *    put:
 *       summary: Delete a user
 *       tags:
 *         - User
 *       parameters:
 *         - name: UserId
 *           in: path
 *           type: string
 *           required: true
<<<<<<< HEAD
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
=======
 *       security:
 *         - bearerAuth: []
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.delete('/user/:userId', authenticator.isServerAdmin, user.deleteUser);

/**
 * @swagger
 * /user/projects:
 *    get:
 *       summary: Return a list of projects in which user is a member
 *       tags:
 *         - User
<<<<<<< HEAD
 *       parameters:
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
=======
 *       security:
 *         - bearerAuth: []
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.get('/user/projects', authenticator.verifyToken, user.showProject);
<<<<<<< HEAD



/**
 * @swagger
 * /search/user:
 *    get:
 *       summary: find a user
 *       tags:
 *         - Search
 *       parameters:
 *         - name: email
 *           in: query
 *           type: string
 *           required: true
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.get('/search/user', authenticator.verifyToken, user.find);

/**
 * @swagger
 * /task:
 *    post:
 *       summary: Create a task in a project
 *       tags:
 *         - Task
 *       parameters:
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: fix bug
 *               description:
 *                 type: string
 *                 example: this is description
 *               priority:
 *                 type: string
 *                 example: high
 *               start_date:
 *                 type: string
 *                 example: 2024-08-09
 *               expected_end_date:
 *                 type: string
 *                 example: 2024-08-19
 *               assignee_id:
 *                 type: string
 *                 example: 11
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.post(
  '/task',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(8),
  ...validateTask(),
  task.generateTask,
);


/**
 * @swagger
 * /project/tasks:
 *    get:
 *       summary: Search task in a project
 *       tags:
 *         - Project
 *       parameters:
 *         - name: project_id
 *           in: query
 *           type: string
 *         - name: names
 *           in: query
 *           type: string
 *         - name: priority
 *           in: query
 *           type: string
 *         - name: assignee_id
 *           in: query
 *           type: string
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.get(
  '/task',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(11),
  task.getTasks,
);

/**
 * @swagger
 * /task/{id}:
 *    delete:
 *       summary: Delete a task in a project
 *       tags:
 *         - Task
 *       parameters:
 *         - name: id
 *           in: path
 *           type: string
 *           required: true
 *         - name: project_id
 *           in: query
 *           type: string
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */

router.delete(
  '/task/:id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(10),
  task.deleteTask,
);

/**
 * @swagger
 * /task/{id}:
 *    put:
 *       summary: Upddate a task in a project as a assignee
 *       tags:
 *         - Task
 *       parameters:
 *         - name: id
 *           in: path
 *           type: string
 *           required: true
 *         - name: project_id
 *           in: query
 *           type: string
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               colum_id:
 *                 type: string
 *                 example: 1
 *               real_end_date:
 *                 type: string
 *                 example: 2024-08-29
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.put(
  '/task/:id',
  authenticator.verifyToken,
  TaskAut.authenticateUserUpdateTask(),
  task.updateAsAssignee,
);

/**
 * @swagger
 * /update/task/{id}:
 *    put:
 *       summary: Upddate a task in a project as a pm/task creator
 *       tags:
 *         - Task
 *       parameters:
 *         - name: id
 *           in: path
 *           type: string
 *           required: true
 *         - name: project_id
 *           in: query
 *           type: string
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               colum_id:
 *                 type: string
 *                 example: 1
 *               real_end_date:
 *                 type: string
 *                 example: 2024-08-29
 *               start_date:
 *                 type: string
 *                 example: 2024-08-19
 *               assignee_id:
 *                 type: string
 *                 example: 22
 *               priority:
 *                 type: string
 *                 example: high
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.put(
  '/update/task/:id',
  authenticator.verifyToken,
  TaskAut.authenticateUpdateTask(),
  task.update,
);

/**
 * @swagger
 * /comment:
 *    post:
 *       summary: Create a comment in a project
 *       tags:
 *         - Comment
 *       parameters:
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *                 example: 1
 *               task_id:
 *                 type: string
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: example comment
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.post(
  '/comment',
  authenticator.verifyToken,
  CommentAut.authenticateCreateComment(12),
  comment.generate,
);

/**
 * @swagger
 * /comment/{id}:
 *    put:
 *       summary: Edit a comment in a project
 *       tags:
 *         - Comment
 *       parameters:
 *         - name: id
 *           in: path
 *           type: string
 *           required: true
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: example comment
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.put(
  '/comment/:id',
  authenticator.verifyToken,
  CommentAut.authenticateUDComment(),
  comment.update,
);

/**
 * @swagger
 * /reply:
 *    post:
 *       summary: Reply a comment in a project
 *       tags:
 *         - Comment
 *       parameters:
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: example comment
 *               task_id:
 *                 type: string
 *                 example: 1
 *               parent_id:
 *                 type: string
 *                 example: 2
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.post(
  '/reply',
  authenticator.verifyToken,
  CommentAut.authenticateCreateComment(12),
  comment.reply,
);

/**
 * @swagger
 * /comment/{id}:
 *    delete:
 *       summary: Delete a comment in a project
 *       tags:
 *         - Comment
 *       parameters:
 *         - name: id
 *           in: path
 *           type: string
 *           required: true
 *         - name: authorization
 *           in: header
 *           type: string
 *           format: bearer
 *           description: Bearer token for authentication
 *       responses:
 *         '200':
 *           description: OK
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.delete(
  '/comment/:id',
  authenticator.verifyToken,
  CommentAut.authenticateUDComment(),
  comment.destroy,
);
=======
>>>>>>> 6d6bf71c373c27d0b0c6927f43d886df07a5b6c7

export default router;
