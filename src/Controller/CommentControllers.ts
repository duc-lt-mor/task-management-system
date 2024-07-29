import express from 'express';
import * as services from '../Services/CommentServices';
import createHttpError from 'http-errors';
import * as authenticator from '../Middleware/UserAuthenticator';
import { Task } from '../Models/task';

export const generate = async function (
  req: authenticator.CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const task_id = req.body.task_id;
    const key = services.generateKey(task_id);
    const comment = await services.generate({
      task_id,
      key,
      content: req.body.content,
      createdAt: new Date(),
    });
    if (comment) {
      return res.status(200).json(`Commented successfully`);
    }
  } catch (err) {
    next(err);
  }
};

export const createReply = async (parentKey: string, taskId: number, content: string) => {
    // Validate input
    if (!content) {
        throw createHttpError(400, 'Content is required');
    }

    // Find the parent comment using the comment key
    const parentComment: any = await services.find(parentKey);
    if (!parentComment) {
        throw createHttpError(404, 'Parent comment not found');
    }

    const key = await services.generateKey(taskId)
    // Create the reply comment
    try {
        const replyComment = await services.generate({
            content,
            taskId,
            key,
            parentId: parentComment.id, // Set the parentId to link this as a reply
        });

        return replyComment;
    } catch (error) {
        throw createHttpError(500, 'Failed to create reply comment');
    }
};
export const get = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const comments = await services.get();
    if (!comments) {
      const error = createHttpError(400, `Could not get comments`);
      throw error;
    }
    return res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

export const find = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const key = req.params.key;
    const comment = await services.find(key);
    if (!comment) {
      const error = createHttpError(400, `Could not find comment`);
      throw error;
    }
    return res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};

export const update = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const key = req.params.key;
    const content = req.body.content;
    const comment: any = await services.find(key);

    if (!comment) {
      const error = createHttpError(404, `Comment not found`);
      throw error;
    }

    await services.update(key, { content, createdAt: new Date() });
    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};
