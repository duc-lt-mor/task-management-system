import express from 'express';
import * as services from '../Services/CommentServices';
import createHttpError from 'http-errors';
import * as authenticator from '../Middleware/UserAuthenticator';
import { sequelize } from '../Config/config';
import { Comment } from '../Models/comment';
import { Task } from '../Models/task';

export const generate = async function (
  req: authenticator.CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  const transaction = await sequelize.transaction();
  try {
    
    const task_id = req.body.task_id;
    const task = await Task.findByPk(task_id)
    if (task == null) {
      throw new Error('Task not found')
    } 
    const comment: any = await services.generate(
      {
        task_id,
        user_id: req.user?.id,
        content: req.body.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      transaction,
    );

    transaction.commit();
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
  const transaction = await sequelize.transaction();
  try {
    const parent_id = req.body.parent_id;
    const comment: any = await Comment.findByPk(parent_id);
    if (!comment) {
      throw new Error('comment not found')
    }
    const data = {
      task_id: comment.task_id,
      user_id: req.user?.id,
      parent_id,
      content: req.body.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!data.content) {
      throw createHttpError(400, 'Content is required');
    }

    // Find the parent comment using the comment key
    const parentComment: any = await services.find(data.parent_id);
    if (!parentComment) {
      throw createHttpError(404, 'Parent comment not found');
    }

    // Create the reply comment
    try {
      const replyComment = await services.reply(data, transaction);

      await Comment.increment('replies_count', {
        by: 1,
        where: { id: data.parent_id  }
        , transaction:transaction
      });

      await transaction.commit();
      return res.status(200).json(replyComment);
    } catch (error) {
      throw createHttpError(500, 'Failed to create reply comment' + error);
    }
  } catch (err) {
    await transaction.rollback();
    return next(err);
  }
};
export const get = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const task_id = Number(req.query.task_id);
    const parent_id = Number(req.query.parent_id);
    console.log(task_id, parent_id)
    if ( task_id && parent_id) {
      let comment: any = await Comment.findOne({
        where: {
          parent_id: parent_id,
          task_id: task_id
        }
      })
  
      if(!comment) {
        return res.status(404).json([]) ;
      }
    }

    let comments: any = [];
    let replies: any = [];

    if (!isNaN(parent_id)) {
      replies = await services.getReplies(parent_id);
      return res.status(200).json({ replies })
    }

    if (!isNaN(task_id)) {
      comments = await services.get(task_id);
      return res.status(200).json({ comments })
    }

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
      throw createHttpError(400, `Could not find comment`);
    }
    return res.status(200).json(comment);
  } catch (err) {
    return next(err);
  }
};

export const getReplies = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const parent_id = Number(req.query.parent_id);
    const replies = await services.getReplies(parent_id);
    if (!replies) {
      return [];
    }
    return res.status(200).json(replies);
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
    const id = parseInt(req.params.id);
    const content = req.body.content;
    const comment: any = await services.find(id);

    if (!comment) {
      throw createHttpError(404, `Comment not found`);
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
      if (comment.parent_id !== null) {
        const parentComment: any = await services.find(comment.parent_id);

        if (parentComment) {
          await Comment.increment('replies_count', {
            by: -1,
            where: { id: parentComment.id },
          });
        }
      }

      await services.destroy(id);
      return res.status(200).json(`Deleted`);
    }
  } catch (err) {
    return next(err);
  }
};
