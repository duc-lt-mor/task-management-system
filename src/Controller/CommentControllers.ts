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
      user_id: req.user?.id,
      content: req.body.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!comment) {
      throw createHttpError(400, `Could not generate comment`);
    }
    return res.status(200).json({ 'Commented successfully': comment });
  } catch (err) {
    return next(err);
  }
};

export const reply = async function (
  req: authenticator.CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const { task_id, content, parent_id, user_id } = req.body;
    if (!content) {
      throw createHttpError(400, 'Content is required');
    }

    // Find the parent comment using the comment key
    const parentComment: any = await services.find(parent_id);
    if (!parentComment) {
      throw createHttpError(404, 'Parent comment not found');
    }

    // Create the reply comment
    try {
      const replyComment = await services.reply({
        content,
        task_id,
        user_id,
        parent_id: parentComment.id, // Set the parentId to link this as a reply
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

    let comment_updated = await services.update(id, content);

    return res.status(200).json(comment_updated);
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
      await services.destroy(id);
      return res.status(200).json({ message: `Deleted` });
    }
  } catch (err) {
    return next(err);
  }
};
