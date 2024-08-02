import { Op } from "sequelize";
import { Keyword } from "../Models/keyword";
import { Task } from "../Models/task";

export const addKeyword = function (parts: string) {
    const keywords = parts.split(/[,;|]/)
    for (const keyword of keywords) {
      Keyword.create({keyword})
    }
  }
  
  export const search = async function (value: string | number) {
    const isNumeric = !isNaN(Number(value))
    const conditions: any[] = [
      {name: {[Op.like]: `%${value}`}},
      {key: {[Op.like]: `%${value}`}},
      ...(isNumeric? [
        { creator_id: value },
        { project_id: value },
        { assignee_id: value },
        { priority: value }
      ]: [])
    ]
  
    const tasks = await Task.findAll({
      include: [
        {
          model: Keyword,
          where: {
            keyword: {
              [Op.like]: `%${value}`,
            },
          },
          through: {
            attributes: []
          }
        },
      ], where: {
        [Op.or]: conditions
      }
    });
    
    return tasks
  };