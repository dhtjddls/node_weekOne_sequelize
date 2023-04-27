const { Posts } = require("../models");
const PostRepository = require("../repositories/posts.repository");

class PostService {
  postRepository = new PostRepository(Posts);

  findAllPost = async () => {
    const allPost = await this.postRepository.findAllPost();

    return allPost.map((a) => {
      return {
        postId: a.postId,
        userId: a.UserId,
        nickname: a.nickname,
        title: a.title,
        likes: a.likes,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };
    });
  };

  findOnePost = async (postId) => {
    const Post = await this.postRepository.findOnePost(postId);

    return {
      postId: Post.postId,
      userId: Post.UserId,
      nickname: Post.nickname,
      title: Post.title,
      content: Post.content,
      likes: Post.likes,
      createdAt: Post.createdAt,
      updatedAt: Post.updatedAt,
    };
  };

  createPost = async (nickname, userId, title, content) => {
    const createPostData = await this.postRepository.createPost(
      nickname,
      userId,
      title,
      content
    );

    return { message: "게시글 작성에 성공하였습니다." };
  };

  putPost = async (title, content, postId, userId) => {
    const putPostData = await this.postRepository.putPost(
      title,
      content,
      postId,
      userId
    );
    return { message: "게시글을 수정하였습니다." };
  };

  deletePost = async (postId, userId) => {
    const deletePostData = await this.postRepository.deletePost(postId, userId);
    return { message: "게시글을 삭제하였습니다." };
  };

  findLikedPost = async (likedData) => {
    const findLikedPostData = await this.postRepository.findLikedPost(
      likedData
    );

    const posts = findLikedPostData.map((post) => ({
      postId: post.postId,
      userId: post.UserId,
      nickname: post.nickname,
      title: post.title,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likes: post.like,
    }));

    return posts;
  };

  postDecreaseLike = async (postId, userId) => {
    const postDecreaseLikeData = await this.postRepository.postDecreaseLike(
      postId,
      userId
    );
    return postDecreaseLikeData;
  };

  postIncreaseLike = async (postId, userId) => {
    const postIncreaseLikeData = await this.postRepository.postIncreaseLike(
      postId,
      userId
    );
    return postIncreaseLikeData;
  };
}

module.exports = PostService;
