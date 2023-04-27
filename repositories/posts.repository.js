const { Posts } = require("../models");
const { Op } = require("sequelize");

class PostRepository {
  findAllPost = async () => {
    // ORM인 Sequelize에서 Posts 모델의 findAll 메소드를 사용해 데이터를 요청합니다.
    const posts = await Posts.findAll({
      attributes: [
        "postId",
        "UserId",
        "nickname",
        "title",
        "createdAt",
        "updatedAt",
        "likes",
      ],
      order: [["createdAt", "DESC"]],
    });
    return posts;
  };

  findOnePost = async (postId) => {
    console.log(postId);
    const post = await Posts.findOne({
      attributes: [
        "postId",
        "UserId",
        "nickname",
        "title",
        "content",
        "likes",
        "createdAt",
        "updatedAt",
      ],
      where: { postId: postId },
    });
    return post;
  };

  createPost = async (nickname, userId, title, content) => {
    // ORM인 Sequelize에서 Posts 모델의 create 메소드를 사용해 데이터를 요청합니다.
    console.log(nickname, userId, title, content);
    const createPostData = await Posts.create({
      UserId: userId,
      title,
      content,
      nickname,
    });

    return createPostData;
  };

  putPost = async (title, content, postId, userId) => {
    const putPostData = await Posts.update(
      { title, content },
      {
        where: {
          [Op.and]: [{ postId: postId }, { UserId: userId }],
        },
      }
    );

    return putPostData;
  };

  deletePost = async (postId, userId) => {
    const deletePost = await Posts.destroy({
      where: {
        [Op.and]: [{ postId: postId }, { UserId: userId }],
      },
    });
    return deletePost;
  };

  findLikedPost = async (likedData) => {
    const likedPostData = await Posts.findAll({
      where: {
        postId: {
          [Op.in]: likedData,
        },
      },
    });
    return likedPostData;
  };

  postDecreaseLike = async (postId, userId) => {
    const postDecrease = await Posts.findOne({
      where: { postId: postId },
    });
    await postDecrease.decrement("likes", { by: 1 });
    return postDecrease;
  };

  postIncreaseLike = async (postId, userId) => {
    const postIncrease = await Posts.findOne({
      where: { postId: postId },
    });
    await postIncrease.increment("likes", { by: 1 });

    return postIncrease;
  };
}

module.exports = PostRepository;
