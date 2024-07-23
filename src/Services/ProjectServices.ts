import { System_role } from '../Models/system_role';
import { Role } from '../Models/role';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Task } from '../Models/task';
import { Comment } from '../Models/comment';
import { Login } from '../Models/login';
import { Member } from '../Models/member';
import { Colum } from '../Models/colum';
const { Op } = require('sequelize');

// lay ra 1 project
export const getProjectById = async (id: number) => {
  let project = await Project.findOne({
    where: {
      id: id,
    },
  });
  return project;
};
// tao 1 project
export const createProject = async (
  name: String,
  key: String,
  decripstion: String,
  creator_id: number,
  expected_end_date: Date,
) => {
  try {
    let project: any = await Project.create({
      name: name,
      key: key,
      decripstion: decripstion,
      creator_id: creator_id,
      expected_end_date: expected_end_date,
    });
    // khoi tao 3 cot mac dinh (todo, inprogress, done)
    await Colum.bulkCreate([
      { col_type: 'todo', name: 'TO DO', col_index: 1, project_id: project.id },
      {
        col_type: 'in_progress',
        name: 'IN PROGRESS',
        col_index: 2,
        project_id: project.id,
      },
      { col_type: 'done', name: 'DONE', col_index: 3, project_id: project.id },
    ]);
  } catch (err) {
    throw new Error('Create fail' + err);
  }
};
//xac thuc du lieu dau vao
export const validateProject = async (
  name: String,
  key: String,
  expected_end_date: Date,
) => {
  let err: Array<string> = [];
  let current_date: Date = new Date();
  if (!name) {
    err.push('Please enter project name');
  }
  if (!key) {
    err.push('Please enter project_key');
  }
  if (expected_end_date < current_date || isNaN(expected_end_date.getTime())) {
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
  return err;
};
// sua project
export const editProject = async (
  name: String,
  decripstion: String,
  expected_end_date: Date,
  id: number,
) => {
  let project: any = await getProjectById(id);
  await project.update({
    name: name,
    decripstion: decripstion,
    expected_end_date: expected_end_date,
  });
};
//xoa project
export const deleteProject = async (id: number) => {

  // xoa cac thanh vien khoi project
  await Member.destroy({
    where: {
      project_id: id,
    },
  });

  //xoa cac cot co trong project
   await Colum.destroy({
    where: {
      project_id: id,
    },
  });

  await Project.destroy({
    where: {
      id: id,
    },
  });
  
  
};
//them thanh vien vafo project
export const addMember = async (
  project_id: number,
  user_id: number,
  role_id: number,
) => {
  await Member.create({
    user_id: user_id,
    project_id: project_id,
    role_id: role_id,
  });
};
//xoa thanh vien khoi project
export const removeMember = async (user_id: number, project_id: number) => {
  await Member.destroy({
    where: {
      [Op.or]: [{ user_id: user_id }, { project_id: project_id }],
    },
  });
};
//cap nhat role cua thanh vien trong project
export const editMemRole = async (
  project_id: number,
  user_id: number,
  role_id: number,
) => {
  let member: any = await Member.findOne({
    where: {
      user_id: user_id,
      project_id: project_id,
    },
  });
  await member.update({
    role_id: role_id,
  });
};
//tao cot
export const createColum = async (
  col_type: string,
  name: string,
  index: number,
  project_id: number,
) => {
  await Colum.create({
    col_type: col_type,
    name: name,
    col_index: index,
    project_id: project_id,
  });
};
//kiem tra du lieu dau vao cua cot
export const validateColum = async (
  col_type: string,
  name: string,
  project_id: number,
) => {
  let err: Array<string> = [];
  if (!col_type) {
    err.push('please enter colum type');
  }
  if (!name) {
    err.push('please enter colum name');
  }
  let colum: any = await Colum.findOne({
    where: {
      [Op.and]: [{ name: name }, { project_id: project_id }],
    },
  });
  if (colum) {
    err.push('colum name already exit');
  }
  return err;
};
//chinh sua cot
export const editColum = async (
  col_type: string,
  name: string,
  index: number,
  col_id: number,
  project_id: number,
) => {
  let respons: Array<string> = [];
  //lay ra cot can sua
  let colum: any = await Colum.findOne({
    where: {
      id: col_id,
    },
  });
  //tim trong bang xem co cot nao thuoc cung project co ten bi trung voi ten vua nhap hay khong
  let colum2: any = await Colum.findOne({
    where: {
      [Op.and]: [
        { name: name },
        { project_id: project_id },
        { id: { [Op.ne]: col_id } },
      ],
    },
  });

  if (colum2) {
    respons.push('colum name already been used');
  } else {
    if (!name) {
      respons.push('colum name remain');
    } else if (name === colum.name) {
      respons.push('colum name remain');
    } else {
      await colum.update({
        name: name,
      });
      respons.push('colum name updated');
    }
  }

  if (!col_type) {
    respons.push('colum type remain');
  } else if (col_type === colum.col_type) {
    respons.push('colum type remain');
  } else {
    await colum.update({
      col_type: col_type,
    });
    respons.push('colum type updated');
  }

  if (isNaN(index)) {
    respons.push('colum index remain');
  } else if (index == colum.col_index || index <= 0) {
    respons.push('colum index remain');
  } else {
    //neu vi tri moi nho hon vi tri hien tai
    if (index < colum.col_index) {
      //tang gia tri col_index cua cac cot tu vi tri hien tai den vi tri moi
      for (let i: number = colum.col_index - 1; i >= index; i--) {
        let col1: any = await Colum.findOne({
          where: {
            [Op.and]: [{ col_index: i }, { project_id: project_id }],
          },
        });
        await col1.update({
          col_index: i + 1,
        });
      }
    }
    //neu vi tri moi lon hon vi tri hien tai
    else {
      //giam gia tri col_index cua cac cot tu vi tri hien tai den vi tri moi
      for (let i: number = colum.col_index + 1; i <= index; i++) {
        let col1: any = await Colum.findOne({
          where: {
            [Op.and]: [{ col_index: i }, { project_id: project_id }],
          },
        });
        await col1.update({
          col_index: i - 1,
        });
      }
    }

    await colum.update({
      col_index: index,
    });
    respons.push('colum index updated');
  }

  return respons;
};
//xoa cot 
export const deleteColum = async (id: number) => {
  await Colum.destroy({
    where: {
      id: id,
    },
  });
};
