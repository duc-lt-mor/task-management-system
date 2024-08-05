export interface Roles {
    [role: string]: string[];
  }

export const ADMIN = 1
export const PROJECT_MANAGER = 2
export const TEAM_LEADER = 3
export const USER = 4

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
    'update_task',
    'delete_task',
  ],
  [PROJECT_MANAGER]: [
    'update_user',
    'create_project',
    'update_project',
    'add_user_to_project',
    'remove_user_from_project',
    'delete_project',
    'create_task',
    'update_task',
    'delete_task',
  ],
  [TEAM_LEADER]: ['update_user', 'create_task', 'update_task', 'delete_task'],
  [USER]: ['update_user', 'update_task'],
};