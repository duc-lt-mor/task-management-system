import express from 'express';
import * as services from '../Services/CommentServices';
import createHttpError from 'http-errors';
import * as authenticator from '../Middleware/UserAuthenticator';

export const generate = async function (
  req: authenticator.CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const task_id = req.body.task_id;
    const comment: any = await services.generate({
      task_id,
      user_id: req.body.user_id,
      content: req.body.content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(comment)
    if (!comment) {
      throw createHttpError(400, `Could not generate comment`)
    }
    return res.status(200).json(`Commented successfully`);
  } catch (err) {
    console.log(err)
    return next(err);
  }
};

export const reply = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const { taskId, content, parentKey } = req.body;
    if (!content) {
      throw createHttpError(400, 'Content is required');
    }

    // Find the parent comment using the comment key
    const parentComment: any = await services.find(parentKey);
    if (!parentComment) {
      throw createHttpError(404, 'Parent comment not found');
    }

    // Create the reply comment
    try {
      const replyComment = await services.reply({
        content,
        taskId,
        parentId: parentComment.id, // Set the parentId to link this as a reply
      });

      return res.status(200).json(replyComment);
    } catch (error) {
      throw createHttpError(500, 'Failed to create reply comment');
    }
  } catch (err) {
    return next(err);
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
    return next(err);
  }
};

export const find = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const comment = await services.find(id);
    if (!comment) {
      const error = createHttpError(400, `Could not find comment`);
      throw error;
    }
    return res.status(200).json(comment);
  } catch (err) {
    return next(err);
  }
};

export const update = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const content = req.body.content;
    const comment: any = await services.find(id);

    if (!comment) {
      const error = createHttpError(404, `Comment not found`);
      throw error;
    }

    await services.update(id, { content, createdAt: new Date() });
    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    return next(err);
  }
};

export const destroy = async function (
  req: authenticator.CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const comment: any = await services.find(id);
    if (!comment) {
      throw createHttpError(404, `Comment not found`);
    }

    if (comment.user_id != req.user?.id) {
      throw createHttpError(
        403,
        `You are not authorized to deleted this comment`,
      );
    } else {
      const deleted = services.destroy(id);
      return res.status(200).json({ message: `Deleted`, deleted });
    }
  } catch (err) {
    return next(err);
  }
};
