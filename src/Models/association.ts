import { Keyword } from './keyword';
import { Task } from './task';
import { TaskKeyword } from './task_keyword';

Keyword.belongsToMany(Task, { through: TaskKeyword, foreignKey: 'keyword_id', otherKey: 'task_id' });
Task.belongsToMany(Keyword, { through: TaskKeyword, foreignKey: 'task_id', otherKey: 'keyword_id' });
