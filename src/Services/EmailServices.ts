import nodemailer from 'nodemailer';
import { Task } from '../Models/task';
import { User } from '../Models/user';
import { Op } from 'sequelize';

let transporter: nodemailer.Transporter;
const email = process.env.EMAIL
const password = process.env.EMAIL_PASSWORD

export const initializeEmail = (service: 'gmail' | 'outlook') => {
  transporter = nodemailer.createTransport({
    service: service === 'gmail' ? 'Gmail' : 'Outlook365',
    auth: {
      user: email,
      pass: password,
    },
  });
};

export const send = async (
  to: string,
  assigneeName: string,
  senderEmail: string,
  task: any,
) => {
  if (!transporter) {
    throw new Error(`Email service not initialized`);
  }

  const options = {
    from: email,
    to,
    subject: '',
    text: `Hello, ${assigneeName}

      You have been assigned a new task: ${task.name}.
      
      Task Details:
      - Task Name: ${task.name}
      - Assigner: ${task.creator_id}
      - Description: ${task.description}
      - Priority: ${task.priority}
      - Start Date: ${task.start_date}
      - Expected End Date: ${task.expected_end_date}
      
      Please check your tasks for more details.
      
      Best regards,
      ${senderEmail}`,
  };
  try {
    const info = await transporter.sendMail(options);
    return info.response;
  } catch (err) {
    console.log(err);
  }
};

export const notifyReplies = async (senderID: number, receiverID: number) => {
  const sender: any = await User.findOne({
    where: { id: senderID },
    attributes: ['name'],
  });
  const receiver: any = await User.findOne({
    where: { id: receiverID },
    attributes: ['name', 'email'],
  });
  const options = {
    from: email,
    to: receiver.email,
    subject: `Comment notification`,
    text: `${receiver.name}, ${sender.name} has replied to your comment, please open to see details`,
  };
  console.log(receiver.email);
  try {
    const reply = await transporter.sendMail(options);
    return reply.response;
  } catch (err) {}
};

export const notifyComment = async (senderID: number, receiverID: number) => {
  const sender: any = await User.findOne({
    where: { id: senderID },
    attributes: ['name', 'email'],
  });
  const receiver: any = await User.findOne({
    where: { id: receiverID },
    attributes: ['name', 'email'],
  });
  const notification = {
    from: email,
    to: receiver.email,
    subject: `Comment notification`,
    text: `${receiver.name}, ${sender.name} has just commented on your assigned task, please log in to check further details`,
  };
  try {
    console.log(receiver.email);
    const comment = transporter.sendMail(notification);
    return comment;
  } catch (err) {
    return err;
  }
};

export const notifyUpdates = async (task_id: number) => {
  const task: any = await Task.findByPk(task_id, {
    attributes: ['key', 'project_id', 'assignee_id', 'creator_id'],
  });

  const users: any = await User.findAll({
    where: {
      [Op.or]: [
        { id: task.creator_id },
        { id: task.assignee_id }
      ]
    },
    attributes: ['name', 'email'],
  });
  const emails = users.map((user: any) => user.email).join(', ');

  const details = {
    from: email,
    to: emails,
    subject: 'Task update',
    text: `Task ${task.key} of project ${task.project_id} has been updated. Please log in for further details`
  }
  console.log(emails)
  try {
    const update = await transporter.sendMail(details)
    return update.response
  } catch(err) {
    return err
  }
};
