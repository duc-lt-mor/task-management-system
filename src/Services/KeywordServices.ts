import { Op, Transaction } from 'sequelize';
import { Keyword } from '../Models/keyword';
import { Task } from '../Models/task';
import { TaskKeyword } from '../Models/task_keyword';
import { sequelize } from '../Config/config';

export const addKeyword = async function (
  tasks: string[],
  transaction: Transaction,
  id: number,
) {
  const keywords: string[] = [];
  for (const task in tasks) {
    const words = tasks[task].split(' ');
    for (const i in words) {
      keywords.push(words[i]);
    }
  }
  const records: { keyword: string; id: number }[] = [];

  for (const keyword of keywords) {
    let word: any = await Keyword.findOne({
      where: { keyword: keyword },
      transaction,
    });
    if (!word) {
      word = await Keyword.create({ keyword }, { transaction });
      records.push({ keyword, id: word.id });
    }
    TaskKeyword.create({ task_id: id, keyword_id: word.id });
  }

  return records;
};

export const search = async function (query: any) {
  const {
    names,
    priority,
    status,
    assignee_id,
    project_id,
    start_date,
    end_date,
  } = query;
  if (!names && !priority && !status && !assignee_id && !start_date && !end_date && !project_id) {
    return await Task.findAll();
  }

  const filter: any = {
    where: {project_id: project_id},
  };

  if (names) {
    const keywordsArray = names.split(` `);
    const keywords: any = await Keyword.findAll({
      where: {
        keyword: {
          [Op.or]: keywordsArray.map((keyword: string) => ({
            [Op.like]: `${keyword}%`,
          })),
        },
      },
      attributes: ['id'],
    });
    if (keywords.length == 0) {
      return [];
    } else {
      const keywordIDs = await keywords.map(
        (keyword: { id: any }) => keyword.id,
      );

      const taskKeywords: any = await TaskKeyword.findAll({
        where: {
          keyword_id: {
            [Op.in]: keywordIDs,
          },
        },
        attributes: ['task_id'], // Only select the taskId
        group: ['task_id'],
        having: sequelize.literal(
          `COUNT(DISTINCT keyword_id) = ${keywordsArray.length}`,
        ),
      });
      const taskIds = await taskKeywords.map(
        (taskKeyword: { task_id: any }) => taskKeyword.task_id,
      );

      if (taskIds.length > 0) {
        filter.where.id = {
          [Op.in]: taskIds,
        };
      } else if (taskIds.length == 0) {
        return []
      }
    }
  }

  if (priority) {
    filter.where.priority = {
      [Op.like]: `${priority}%`,
    };
  }

  if (status) {
    filter.where.status = {
      [Op.like]: `${status}%`,
    };
  }

  if (assignee_id) {
    filter.where.assignee_id = assignee_id;
  }

  if (project_id) {
    filter.where.project_id = project_id;
  }

  if (start_date && end_date) {
    filter.where.createdAt = {
      [Op.between]: [new Date(start_date), new Date(end_date)],
    };
  }

  const tasks: any = await Task.findAll(filter);

  return tasks;
};
