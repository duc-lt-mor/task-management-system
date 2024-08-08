import * as ProjectController from '../Controller/ProjectController';
import * as ValidateProject from '../Middleware/ValidateProject';
import * as ColumController from '../Controller/ColumnController';
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



/**
 * @swagger
 * /api/auth/login:
 *    post:
 *       summary: Login
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
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
 *               required:
 *                 - email
 *                 - password
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
router.post('/auth/login', user.getLogin);

/**
 * @swagger
 * /api/auth/register:
 *    post:
 *       summary: Register
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
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
 *               required: 
 *                 - name
 *                 - email
 *                 - password
 *                 - passwordConfirm
 *                 - phone_number
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
  '/auth/register',
  ...userValidator.validateRegister(),
  user.postRegister,
);

/**
 * @swagger
 * /api/users/{userId}:
 *    delete:
 *       summary: Delete a user
 *       tags:
 *         - User
 *       parameters:
 *         - name: UserId
 *           in: path
 *           type: string
 *           required: true
 *       security:
 *         - bearerAuth: []
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
router.delete('/users/:userId', authenticator.isServerAdmin, user.deleteUser);

/**
 * @swagger
 * /api/projects:
 *    get:
 *       summary: Return a list of projects in which user is a member
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
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
router.get('/projects', authenticator.verifyToken, user.showProject);

/**
 * @swagger
 * /api/users:
 *    get:
 *       summary: find a user
 *       tags:
 *         - User
 *       parameters:
 *         - name: email
 *           in: query
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
router.get('/users', authenticator.verifyToken, user.find);


/**
 * @swagger
 * /api/projects:
 *    post:
 *       summary: Create a project
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
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
 *                 description:
 *                   type: string
 *                   example: this is description of project 1
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
  '/projects',
  authenticator.verifyToken,
  ...ValidateProject.validateCreate(),
  ProjectController.create,
);

/**
 * @swagger
 * /api/projects/{project_id}:
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
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: project 1
 *                 description:
 *                   type: string
 *                   example: this is description of project 1
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
  '/projects/:project_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...ValidateProject.validateUpdate(),
  ProjectController.edit,
);

/**
 * @swagger
 * /api/projects/{project_id}:
 *    delete:
 *       summary: Delete a project
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: project_id
 *           in: path
 *           type: integer
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
  '/projects/:project_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ProjectController.destroy,
);

/**
 * @swagger
 * /api/roles:
 *    get:
 *       summary: Show roles of a project
 *       tags:
 *         - Role
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: project_id
 *           in: query
 *           type: integer
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
router.get(
  '/roles',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(1),
  RoleController.showRole,
);


/**
 * @swagger
 * /api/roles:
 *    post:
 *       summary: Create a role
 *       tags:
 *         - Role
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: project 1
 *                 project_id:
 *                   type: integer
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
  '/roles',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateRole(),
  RoleController.create,
);

/**
 * @swagger
 * /api/roles/{role_id}:
 *    put:
 *       summary: Update a role
 *       tags:
 *         - Role
 *       parameters:
 *         - name: role_id
 *           in: path
 *           type: string
 *           required: true
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: project 1
 *                 project_id:
 *                   type: integer
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
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbiden
 *         '500':
 *           description: Internal Server Error
 */
router.put(
  '/roles/:role_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateRole(),
  RoleController.edit,
);

/**
 * @swagger
 * /api/roles/{role_id}:
 *    delete:
 *       summary: Delete a role
 *       tags:
 *         - Role
 *       parameters:
 *         - name: role_id
 *           in: path
 *           type: string
 *           required: true
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
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
  '/roles/:role_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateDelete(),
  RoleController.destroy,
);

/**
 * @swagger
 * /api/members:
 *    get:
 *       summary: Return a list member of a project
 *       tags:
 *         - Member
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: project_id
 *           in: query
 *           type: integer
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
router.get(
  '/members',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(5),
  MemberController.show,
);

/**
 * @swagger
 * /api/members:
 *    post:
 *       summary: Add a user to a project
 *       tags:
 *         - Member
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
 *                   example: 1
 *                 project_role_id:
 *                   type: integer
 *                   example: 1
 *                 add_mem:
 *                   type: string
 *                   example: abc@gmail.com
 *               required:
 *                 - project_id
 *                 - project_role_id
 *                 - add_mem
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
  '/members',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(3),
  ...ValidateMember.addUser(),
  MemberController.add,
);

/**
 * @swagger
 * /api/members/{member_id}:
 *    delete:
 *       summary: Remove a user from project
 *       tags:
 *         - Member
 *       parameters:
 *         - name: member_id
 *           in: path
 *           type: integer
 *           required: true
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
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
  '/members/:member_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(4),
  MemberController.remove,
);

/**
 * @swagger
 * /api/members/{member_id}:
 *    put:
 *       summary: Edit role of a user in a project
 *       tags:
 *         - Member
 *       parameters:
 *         - name: member_id
 *           in: path
 *           type: integer
 *           required: true
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
 *                   example: 1
 *                 project_role_id:
 *                   type: integer
 *                   example: 1
 *               required:
 *                 - project_id
 *                 - project_role_id
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
  '/members/:member_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(2),
  MemberController.editRole,
);


/**
 * @swagger
 * /api/projects/owner:
 *    put:
 *       summary: Change owner of a project
 *       tags:
 *         - Project
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
 *                   example: project 1
 *                 new_project_role_id:
 *                   type: integer
 *                   example: this is description of project 1
 *                 new_owner_id:
 *                   type: integer
 *                   example: 1
 *               required:
 *                 - project_id
 *                 - new_project_role_id
 *                 - new_owner_id
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
  '/projects/owner',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(0),
  ...validateRole.validateChangeOwnerProject(),
  RoleController.changeProjectOwner,
);


/**
 * @swagger
 * /api/columns:
 *    post:
 *       summary: Create a column in a project
 *       tags:
 *         - Column
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: col 1
 *               required:
 *                 - project_id
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
  '/columns',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(13),
  ...ValidateColum.validateCreate(),
  ColumController.create,
);

/**
 * @swagger
 * /api/columns/{col_id}:
 *    put:
 *       summary: Update a column in a project
 *       tags:
 *         - Column
 *       parameters:
 *         - name: col_id
 *           in: path
 *           type: string
 *           required: true
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
 *                   example: 1
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
 *                 - name
 *                 - array_index
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
  '/columns/:col_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(14),
  ...ValidateColum.validateUpdate(),
  ColumController.edit,
);

/**
 * @swagger
 * /api/columns/{col_id}:
 *    delete:
 *       summary: Delete a column in a project
 *       tags:
 *         - Column
 *       parameters:
 *         - name: col_id
 *           in: path
 *           type: string
 *           required: true
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
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
  '/columns/:col_id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(15),
  ...ValidateColum.validateDelete(),
  ColumController.destroy,
);

/**
 * @swagger
 * /api/tasks:
 *    post:
 *       summary: Create a task in a project
 *       tags:
 *         - Task
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: fix bug
 *                 description:
 *                   type: string
 *                   example: this is description
 *                 priority:
 *                   type: string
 *                   enum:
 *                     - low
 *                     - medium
 *                     - high
 *                 start_date:
 *                   type: string
 *                   example: 2024-08-09
 *                 expected_end_date:
 *                   type: string
 *                   example: 2024-08-19
 *                 assignee_id:
 *                   type: integer
 *                   example: 11
 *               required:
 *                 - project_id
 *                 - name
 *                 - priority
 *                 - start_date
 *                 - expected_end_date
 *                 - assignee_id
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
  '/tasks',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(8),
  ...validateTask(),
  task.generateTask,
);

/**
 * @swagger
 * /api/tasks:
 *    get:
 *       summary: Search task in a project
 *       tags:
 *         - Task
 *       parameters:
 *         - name: project_id
 *           in: query
 *           type: string
 *           required: true
 *         - name: names
 *           in: query
 *           type: string
 *         - name: priority
 *           in: query
 *           type: string
 *         - name: assignee_id
 *           in: query
 *           type: string
 *       security:
 *         - bearerAuth: []
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
  '/tasks',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(11),
  task.getTasks,
);

/**
 * @swagger
 * /api/tasks/{id}:
 *    delete:
 *       summary: Delete a task in a project
 *       tags:
 *         - Task
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           type: string
 *           required: true
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
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
  '/tasks/:id',
  authenticator.verifyToken,
  ProjectAut.authenticateProject(10),
  task.deleteTask,
);

/**
 * @swagger
 * /api/tasks/{id}:
 *    put:
 *       summary: Upddate a task in a project
 *       tags:
 *         - Task
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           type: string
 *           required: true
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 project_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: fix bug
 *                 description:
 *                   type: string
 *                   example: this is description
 *                 priority:
 *                   type: string
 *                   enum:
 *                     - low
 *                     - medium
 *                     - high
 *                 start_date:
 *                   type: string
 *                   example: 2024-08-09
 *                 expected_end_date:
 *                   type: string
 *                   example: 2024-08-19
 *                 real_end_date:
 *                   type: string
 *                   example: 2024-08-09
 *                 column_id:
 *                   type: integer
 *                   example: 2024-08-09
 *                 assignee_id:
 *                   type: integer
 *                   example: 11
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
router.put(
  '/tasks/:id',
  authenticator.verifyToken,
  TaskAut.authenticateUpdateTask(),
  ...validateTask(),
  task.update,
);

/**
 * @swagger
 * /api/comments:
 *    post:
 *       summary: Create a comment in a project
 *       tags:
 *         - Comment
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 task_id:
 *                   type: integer
 *                   example: 1
 *                   required: true
 *                 content:
 *                   type: string
 *                   example: example comment
 *                   required: true
 *               required:
 *                 - task_id
 *                 - content
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
  '/comments',
  authenticator.verifyToken,
  CommentAut.authenticateCreateComment(12),
  comment.generate,
);

/**
 * @swagger
 * /api/comments/{id}:
 *    put:
 *       summary: Edit a comment in a project
 *       tags:
 *         - Comment
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           type: string
 *           required: true
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   example: example comment
 *               required: 
 *                 - content
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
  '/comments/:id',
  authenticator.verifyToken,
  CommentAut.authenticateUDComment(),
  comment.update,
);

/**
 * @swagger
 * /api/comments/reply:
 *    post:
 *       summary: Reply a comment in a project
 *       tags:
 *         - Comment
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   example: example comment
 *                 parent_id:
 *                   type: integer
 *                   example: 2
 *               required:
 *                 - parent_id
 *                 - content
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
  '/comments/reply',
  authenticator.verifyToken,
  CommentAut.authenticateCreateComment(12),
  comment.reply,
);

/**
 * @swagger
 * /api/comments/{id}:
 *    delete:
 *       summary: Delete a comment in a project
 *       tags:
 *         - Comment
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
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
  '/comments/:id',
  authenticator.verifyToken,
  CommentAut.authenticateUDComment(),
  comment.destroy,
);

/**
 * @swagger
 * /api/comments:
 *    get:
 *       summary: Get comment in a task
 *       tags:
 *         - Comment
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: task_id
 *           in: query
 *           type: string
 *         - name: parent_id
 *           in: query
 *           type: string
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
router.get('/comments', authenticator.verifyToken, comment.get);

export default router;
