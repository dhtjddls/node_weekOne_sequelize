const PostRepository = require("../../../repositories/posts.repository");
const { Op } = require("sequelize");

let mockPostsModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

let postRepository = new PostRepository(mockPostsModel);

describe("Layered Architecture Pattern Posts Repository Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("findAll test", async () => {
    mockPostsModel.findAll = jest.fn(() => {
      return "findAll";
    });
    const posts = await postRepository.findAllPost();
    const liked = await postRepository.findLikedPost();

    expect(mockPostsModel.findAll).toHaveBeenCalledTimes(2);
    expect(posts).toBe("findAll");
    expect(liked).toBe("findAll");
  });

  test("findOne test", async () => {
    mockPostsModel.findOne = jest.fn(() => {
      return "findOne";
    });

    const post = await postRepository.findOnePost();

    expect(mockPostsModel.findOne).toHaveBeenCalledTimes(1);
    expect(post).toBe("findOne");
  });

  test("create test", async () => {
    mockPostsModel.create = jest.fn(() => {
      return "create";
    });

    const createPostParams = {
      nickname: "createPostNickname",
      UserId: "createPostUserId",
      title: "createPostTitle",
      content: "createPostContent",
    };

    const createPostData = await postRepository.createPost(
      createPostParams.nickname,
      createPostParams.UserId,
      createPostParams.title,
      createPostParams.content
    );

    expect(createPostData).toBe("create");

    expect(mockPostsModel.create).toHaveBeenCalledTimes(1);

    expect(mockPostsModel.create).toHaveBeenCalledWith({
      nickname: createPostParams.nickname,
      UserId: createPostParams.UserId,
      title: createPostParams.title,
      content: createPostParams.content,
    });
  });

  test("update test", async () => {
    mockPostsModel.update = jest.fn(() => {
      return "update";
    });
    const updateParams = {
      title: "createPostTitle",
      content: "createPostContent",
      postId: 1,
      userId: 1,
    };

    const updateData = await postRepository.putPost(
      updateParams.title,
      updateParams.content,
      updateParams.postId,
      updateParams.userId
    );

    expect(mockPostsModel.update).toHaveBeenCalledTimes(1);
    expect(updateData).toBe("update");
    expect(mockPostsModel.update).toHaveBeenCalledWith(
      { title: updateParams.title, content: updateParams.content },
      {
        where: {
          postId: updateParams.postId,
          UserId: updateParams.userId,
        },
      }
    );
  });

  test("destroy test", async () => {
    mockPostsModel.destroy = jest.fn(() => {
      return "destroy";
    });
    const destroyParams = {
      postId: 1,
      userId: 1,
    };

    const destroyData = await postRepository.deletePost(
      destroyParams.postId,
      destroyParams.userId
    );

    expect(mockPostsModel.destroy).toHaveBeenCalledTimes(1);
    expect(destroyData).toBe("destroy");
    expect(mockPostsModel.destroy).toHaveBeenCalledWith({
      where: {
        [Op.and]: [
          { postId: destroyParams.postId },
          { UserId: destroyParams.userId },
        ],
      },
    });
  });
});
