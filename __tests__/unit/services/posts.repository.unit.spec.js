const PostService = require("../../../services/posts.service.js");

let mockPostsRepository = {
  findAllPost: jest.fn(),
  findOnePost: jest.fn(),
  createPost: jest.fn(),
  putPost: jest.fn(),
  deletePost: jest.fn(),
};

let postService = new PostService();
// postService의 Repository를 Mock Repository로 변경합니다.
postService.postRepository = mockPostsRepository;

describe("Layered Architecture Pattern Posts Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("Posts Service findAllPost Method", async () => {
    // findAllPost Method를 실행했을 때, Return 값 입니다.
    const findAllPostReturnValue = [
      {
        postId: 1,
        nickname: "Nickname_1",
        title: "Title_1",
        createdAt: new Date("06 October 2011 15:50 UTC"),
        updatedAt: new Date("06 October 2011 15:50 UTC"),
      },
      {
        postId: 2,
        nickname: "Nickname_2",
        title: "Title_2",
        createdAt: new Date("07 October 2011 15:50 UTC"),
        updatedAt: new Date("07 October 2011 15:50 UTC"),
      },
    ];

    // Repository의 findAllPost Method를 Mocking하고, findAllPostReturnValue를 Return 값으로 변경합니다.
    mockPostsRepository.findAllPost = jest.fn(() => {
      return findAllPostReturnValue;
    });

    // PostService의 findAllPost Method를 실행합니다.
    const allPost = await postService.findAllPost();

    // allPost의 값이 postRepository의 findAllPost Method 결과값을 내림차순으로 정렬한 것이 맞는지 검증합니다.
    expect(allPost).toEqual(
      findAllPostReturnValue.map((a) => {
        return {
          postId: a.postId,
          userId: a.UserId,
          nickname: a.nickname,
          title: a.title,
          likes: a.likes,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        };
      })
    );

    // PostRepository의 findAllPost Method는 1번 호출되었는지 검증합니다.
    expect(mockPostsRepository.findAllPost).toHaveBeenCalledTimes(1);
  });

  //   findOnePost Test
  test("Posts Service findOnePost Method", async () => {
    const findOnePostParam = {
      postId: 1,
    };

    const findOnePostReturnValue = {
      postId: 1,
      UserId: 1,
      nickname: "Nickname_1",
      title: "Title_1",
      content: "Content_1",
      likes: 1,
      createdAt: new Date("06 October 2011 15:50 UTC"),
      updatedAt: new Date("06 October 2011 15:50 UTC"),
    };

    mockPostsRepository.findOnePost = jest.fn(() => {
      return findOnePostReturnValue;
    });

    const post = await postService.findOnePost(findOnePostParam.postId);

    expect(post).toEqual({
      postId: post.postId,
      userId: post.userId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });

    expect(mockPostsRepository.findOnePost).toHaveBeenCalledTimes(1);
  });

  //   createPost Test
  test("Posts Service createPost Method", async () => {
    const createPostParams = {
      nickname: "createPostNickname",
      UserId: "createPostUserId",
      title: "createPostTitle",
      content: "createPostContent",
    };

    mockPostsRepository.createPost = jest.fn(() => {
      return { message: "게시글 작성에 성공하였습니다." };
    });

    const post = await postService.createPost(
      createPostParams.nickname,
      createPostParams.UserId,
      createPostParams.title,
      createPostParams.content
    );

    expect(post).toEqual({ message: "게시글 작성에 성공하였습니다." });

    expect(mockPostsRepository.createPost).toHaveBeenCalledTimes(1);
  });

  //   putPost Test
  test("Posts Service putPost Method", async () => {
    const putPostParams = {
      nickname: "putPostNickname",
      UserId: "putPostUserId",
      title: "putPostTitle",
      content: "putPostContent",
    };

    mockPostsRepository.createPost = jest.fn(() => {
      return { message: "게시글을 수정하였습니다." };
    });

    const post = await postService.putPost(
      putPostParams.nickname,
      putPostParams.UserId,
      putPostParams.title,
      putPostParams.content
    );

    expect(post).toEqual({ message: "게시글을 수정하였습니다." });

    expect(mockPostsRepository.putPost).toHaveBeenCalledTimes(1);
  });

  //   deletePost Test
  test("Posts Service deletePost Method", async () => {
    const deletePost = {
      postId: "putPostpostId",
      UserId: "putPostUserId",
    };

    mockPostsRepository.createPost = jest.fn(() => {
      return { message: "게시글을 삭제하였습니다." };
    });

    const post = await postService.deletePost(
      deletePost.postId,
      deletePost.UserId
    );

    expect(post).toEqual({ message: "게시글을 삭제하였습니다." });

    expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
  });
});
