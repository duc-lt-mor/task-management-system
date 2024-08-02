import { Op, Transaction } from 'sequelize';
import { Keyword } from '../Models/keyword';
import { Task } from '../Models/task';
import { TaskKeyword } from '../Models/task_keyword';


export const addKeyword = function (tasks: string[], transaction: Transaction)  {
  const keywords: string[] = [];
  for (const task in tasks) {
    const words = tasks[task].split(' ');
    for (const i in words) {
      keywords.push(words[i]);
    }
  }

  const uniques = Array.from(new Set(keywords))
  const records: {keyword: string, id: number}[] = []

  for (const keyword of uniques) {
    let word: any = Keyword.findOne({where: {keyword: keyword}, transaction})
    if(!word) {
      word = Keyword.create({ keyword }, { transaction });
    }
    records.push({keyword, id: word.id})
  }

  return records
};

export const search = async function (value: string | number) {
  const keywords: any = await Keyword.findAll({
    where: {
      keyword: {
        [Op.like]: `${value}%`,
      },
    },
    attributes: ['id'],
  });
  const keywordIDs = await keywords.map((keyword: { id: any }) => keyword.id);

  const taskKeywords: any = await TaskKeyword.findAll({
    where: {
      keyword_id: {
        [Op.in]: keywordIDs,
      },
    },
    attributes: ['task_id'], // Only select the taskId
  });
  const taskIds = await taskKeywords.map(
    (taskKeyword: { task_id: any }) => taskKeyword.task_id,
  );

  if (taskIds.length === 0) {
    // If no task keywords found, return an empty result
    return [];
  }

  // 5. Retrieve Tasks
  const tasks = await Task.findAll({
    where: {
      id: {
        [Op.in]: taskIds,
      },
    },
  });

  return tasks;
};
