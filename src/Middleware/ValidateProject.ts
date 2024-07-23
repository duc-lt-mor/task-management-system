import { Project } from '../Models/project';
import  Op   from 'sequelize';
import express from 'express';
//xac thuc du lieu dau vao
export const validate = async function (
    req: express.Request,
    res: express.Response,
  ) {
    let name: string = req.body.name;
    let key: string = req.body.key;
    let expected_end_date: string = req.body.expected_end_date;
    let create_date: Date = new Date(expected_end_date);
    let trim_name: string = name.trim();
    let trim_key: string = key.trim();
    let err: Array<string> = [];
    let current_date: Date = new Date();
    if (!trim_name) {
      err.push('Please enter project name');
    }
    if (!trim_key) {
      err.push('Please enter project_key');
    }
    if (create_date < current_date || isNaN(create_date.getTime())) {
      err.push(`expected end date must later than ${current_date}`);
    }
    let project_found = await Project.findOne({
      where: {
        [Op.or]: [{ name: name }, { key: key }],
      },
    });
    if (project_found != null) {
      err.push('project name or project key already been used');
    }
    return res.status(400).send(err);
  };