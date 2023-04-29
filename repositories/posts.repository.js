const { Op } = require("sequelize");

class PostRepository {
  constructor(postsModel) {
    this.Posts = postsModel;
  }
  findAllPost = async () => {
    // ORM인 Sequelize에서 Posts 모델의 findAll 메소드를 사용해 데이터를 요청합니다.
    const posts = await this.Posts.findAll({
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
    const post = await this.Posts.findOne({
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

    const createPostData = await this.Posts.create({
      UserId: userId,
      title,
      content,
      nickname,
    });

    return createPostData;
  };

  putPost = async (title, content, postId, userId) => {
    const putPostData = await this.Posts.update(
      { title, content },
      {
        where: {
          postId: postId,
          UserId: userId,
        },
      }
    );

    return putPostData;
  };

  deletePost = async (postId, userId) => {
    const deletePost = await this.Posts.destroy({
      where: {
        [Op.and]: [{ postId: postId }, { UserId: userId }],
      },
    });
    return deletePost;
  };

  findLikedPost = async (likedData) => {
    const likedPostData = await this.Posts.findAll({
      where: {
        postId: {
          [Op.in]: likedData,
        },
      },
    });
    return likedPostData;
  };

  postDecreaseLike = async (postId, userId) => {
    const postDecrease = await this.Posts.findOne({
      where: { postId: postId },
    });
    await postDecrease.decrement("likes", { by: 1 });
    return postDecrease;
  };

  postIncreaseLike = async (postId, userId) => {
    const postIncrease = await this.Posts.findOne({
      where: { postId: postId },
    });
    await postIncrease.increment("likes", { by: 1 });

    return postIncrease;
  };
}

module.exports = PostRepository;
