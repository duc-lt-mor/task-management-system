import { Task } from '../Models/task';
import { Project } from '../Models/project';

export const create = async function (data: any) {
  return await Task.create(data);
};

export const generateKey = async function (project_id: number) {
  const project: any = await Project.findByPk(project_id)
  if (!project) {
    throw new Error(`Project not found`)
  }
  const count = await Task.count({where: {project_id: project_id}})
  const newID = count + 1
  const projectPrefix = project.prefix || `PROJ${project_id}`
  const key = `${projectPrefix}-${newID.toString().padStart(4, '0')}`
  return key
}

export const find = async function (key: string) {
  return await Task.findOne({ where: { key: key } });
};

export const get = async function () {
  return await Task.findAll();
};

export const update = async function (key: string, data: any, ) {
    const task: any = Task.findByPk(key)
    if (!task) {
        return {success: false}
    }
    if (data.status !== undefined) {
        task.status = data.status
    }

    if (data.assignee_id !== undefined) {
        task.assignee_id = data.assignee_id
    }

    if (data.priority) {
        task.priority = data.priority
    }

    if (data.real_end_date !== undefined) {
        task.real_end_date = data.real_end_date
    }
}

export const deleteTask = async function (key: string) {
  return await Task.destroy({ where: { key: key } });
};
