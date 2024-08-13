import nodemailer from 'nodemailer';
import { Task } from '../Models/task';
import { User } from '../Models/user';
import { Comment } from '../Models/comment';
import { Project } from '../Models/project';
import { Project_role } from '../Models/project_role';

let transporter: nodemailer.Transporter;

export const initializeEmail = (service: 'gmail' | 'outlook') => {
  transporter = nodemailer.createTransport({
    service: service === 'gmail' ? 'Gmail' : 'Outlook365',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
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
    from: process.env.EMAIL,
    to,
    subject: '',
    text: `Hello, ${assigneeName}

      You have been assigned a new task: ${task.name}.
      
      Task Details:
      - Task Name: ${task.name}
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
    from: process.env.EMAIL,
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
    from: process.env.EMAIL,
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

export const sendmailMemConfirm = async (
  receviver_email: string,
  project_id: number,
  project_role_id: number,
  link: string,
) => {
  let project: any = await Project.findByPk(project_id);

  let role: any = await Project_role.findByPk(project_role_id);

  if (!transporter) {
    throw new Error(`Email service not initialized`);
  }

  const options = {
    from: process.env.EMAIL,
    to: receviver_email,
    subject: '',
    text: ``,
    html: `<div>
    <p> 
    Hello, ${receviver_email}
       <br>
      You have been invited to a project ${project.name} as a ${role.name}
       <br>
      Please check click the link down here to accept. It will expired in 1 hours.
      <br>
      Best regards,
       <br>
      ${process.env.EMAIL}
    </p>
    <br>
    <a href=${link}>Click here to accept</a>
    
    </div>`,
  };
  try {
    const info = await transporter.sendMail(options);
    return info.response;
  } catch (err) {
    console.log(err);
  }
};
