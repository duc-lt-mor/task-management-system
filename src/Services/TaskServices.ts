import { Task } from "../Models/task";

export const generate = async function (data: any) {
    const task = await Task.create(data)
    return task
}

export const find = async function (name: string) {
    const task = await Task.findOne({where: {name}})
    return task
}

export const get = async function () {
    const tasks = await Task.findAll()
    return tasks
}

//find task and update status by id
export const updateStatus = async function (id: number, status: number) {
    const task: any = await Task.findByPk(id)
    if (!task) {
        return {success: false}
    }
    task.status = status
    await task.save()
    return task
}
