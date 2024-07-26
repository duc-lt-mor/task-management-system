import { Task } from '../Models/task';
import { Project } from '../Models/project';

export const create = async function (data: any) {
  return await Task.create(data);
};

export const generateKey = async function (projectID: number) {
  const project = await Project.findByPk(projectID)
  if (!project) {
    throw new Error(`Project not found`)
  }
  const count = await Task.count({where: {projectID: projectID}})
  const newID = count + 1
}

export const find = async function (id: number) {
  return await Task.findOne({ where: { id } });
};

export const get = async function () {
  return await Task.findAll();
};

export const update = async function (id: number, data: any, ) {
    const task: any = find(id)
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

export const deleteTask = async function (id: number) {
  return await Task.destroy({ where: { id } });
};
