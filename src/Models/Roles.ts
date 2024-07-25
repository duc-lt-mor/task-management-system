export interface Roles {
    [role: string]: string[];
  }

export const ADMIN = 'admin'
export const PROJECT_MANAGER = 'project_manager'
export const TEAM_LEADER = 'team_leader'
export const USER = 'user'

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
