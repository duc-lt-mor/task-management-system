import { Keyword } from './keyword';
import { Task } from './task';
import { TaskKeyword } from './task_keyword';

Task.belongsToMany(Keyword, { through: TaskKeyword });
Keyword.belongsToMany(Task, { through: TaskKeyword });
