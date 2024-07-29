export interface Roles {
  [role: string]: string[];
}

export const ADMIN = 1;
export const SYSTEM_USER = 2;
export const PROJECT_MANAGER = 3;
export const TEAM_LEADER = 4;
export const USER = 5;

export const roles: Roles = {
  [ADMIN]: [
    'create_user',
    'update_user',
    'delete_user',
    'create_project',
    'update_project',
    'add_user_to_project',
    'remove_user_from_project',
    'delete_project',
    'create_task',
    'view-task',
    'update_task',
    'delete_task',
    'comment',
  ],
  [SYSTEM_USER]: ['create_project'],
  [PROJECT_MANAGER]: [
    'update_user',
    'create_project',
    'update_project',
    'add_user_to_project',
    'remove_user_from_project',
    'delete_project',
    'create_task',
    'view-task',
    'update_task',
    'delete_task',
    'comment',
  ],
  [TEAM_LEADER]: [
    'update_user',
    'create_task',
    'view-task',
    'update_task',
    'delete_task',
    'comment',
  ],
  [USER]: ['update_user', 'view-task', 'update_task', 'comment'],
};
