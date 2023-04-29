// __tests__/unit/posts.controller.unit.spec.js
const { tryCatch } = require("../../../utils/tryCatch.js");

const PostsController = require("../../../controllers/posts.controller.js");

// 요청을 보낼 다른 계층의 도구들은 mocking을 통해 가상 객체로 대체!
let mockPostService = {
  findAllPost: jest.fn(),
  findOnePost: jest.fn(),
  createPost: jest.fn(),
  putPost: jest.fn(),
  deletePost: jest.fn(),
};

let mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: {},
};

let postsController = new PostsController();
// postsController의 Service를 Mock Service로 변경합니다.
postsController.postService = mockPostService;

describe("Layered Architecture Pattern Posts Controller Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
  });

  test("Posts Controller getPosts Method by Success", async () => {
    // PostService의 findAllPost Method를 실행했을 때 Return 값을 변수로 선언합니다.
    const postsReturnValue = [
      {
        postId: 2,
        nickname: "Nickname_2",
        title: "Title_2",
        createdAt: new Date("07 October 2011 15:50 UTC"),
        updatedAt: new Date("07 October 2011 15:50 UTC"),
      },
      {
        postId: 1,
        nickname: "Nickname_1",
        title: "Title_1",
        createdAt: new Date("06 October 2011 15:50 UTC"),
        updatedAt: new Date("06 October 2011 15:50 UTC"),
      },
    ];

    // PostService의 findAllPost Method를 실행했을 때 Return 값을 postsReturnValue 변수로 설정합니다.
    mockPostService.findAllPost = jest.fn(() => postsReturnValue);

    // PostsController의 getPosts Method를 실행합니다.
    await postsController.getPosts(mockRequest, mockResponse);

    /** PostsController.getPosts 비즈니스 로직 **/
    // 1. PostService의 findAllPost Method를 1회 호출합니다.
    // 2. res.status는 1번 호출되고, 200의 값을 반환합니다.
    // 3. findAllPost Method에서 반환된 posts 변수의 값을 res.json Method를 이용해 { data: posts }의 형식으로 반환합니다.

    // 1. PostService의 findAllPost Method를 1회 호출합니다.
    expect(mockPostService.findAllPost).toHaveBeenCalledTimes(1);

    // 2. res.status는 1번 호출되고, 200의 값을 반환합니다.
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. findAllPost Method에서 반환된 posts 변수의 값을 res.json Method를 이용해 { data: posts }의 형식으로 반환합니다.
    expect(mockResponse.json).toHaveBeenCalledWith({
      posts: postsReturnValue,
    });
  });

  test("Posts Controller getPost Method by Success", async () => {
    // PostService의 findAllPost Method를 실행했을 때 Return 값을 변수로 선언합니다.
    const getPostReqParam = {
      postId: 1,
    };

    mockRequest.params = getPostReqParam;

    const getPostReturnValue = {
      postId: 1,
      UserId: 1,
      nickname: "Nickname_1",
      title: "Title_1",
      content: "Content_1",
      likes: 1,
      createdAt: new Date("06 October 2011 15:50 UTC"),
      updatedAt: new Date("06 October 2011 15:50 UTC"),
    };

    // PostService의 findAllPost Method를 실행했을 때 Return 값을 postsReturnValue 변수로 설정합니다.
    mockPostService.findOnePost = jest.fn(() => getPostReturnValue);

    // PostsController의 getPosts Method를 실행합니다.
    await postsController.getPost(mockRequest, mockResponse);

    /** PostsController.getPosts 비즈니스 로직 **/
    // 1. PostService의 findAllPost Method를 1회 호출합니다.
    // 2. res.status는 1번 호출되고, 200의 값을 반환합니다.
    // 3. findAllPost Method에서 반환된 posts 변수의 값을 res.json Method를 이용해 { data: posts }의 형식으로 반환합니다.

    // 1. PostService의 findAllPost Method를 1회 호출합니다.
    expect(mockPostService.findOnePost).toHaveBeenCalledTimes(1);
    expect(mockPostService.findOnePost).toHaveBeenCalledWith(
      getPostReqParam.postId
    );

    // 2. res.status는 1번 호출되고, 200의 값을 반환합니다.
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. findAllPost Method에서 반환된 posts 변수의 값을 res.json Method를 이용해 { data: posts }의 형식으로 반환합니다.
    expect(mockResponse.json).toHaveBeenCalledWith({
      post: getPostReturnValue,
    });
  });

  test("Posts Controller createPost Method by Success", async () => {
    const createPostRequestBodyParams = {
      title: "Title_Success",
      content: "Content_Success",
    };
    const createPostResLocals = {
      nickname: "Nickname_Success",
      userId: 1,
    };

    mockRequest.body = createPostRequestBodyParams;
    mockResponse.locals.user = createPostResLocals;

    const createPostReturnValue = { message: "게시글 생성 성공" };

    mockPostService.createPost = jest.fn(() => createPostReturnValue);

    await postsController.createPost(mockRequest, mockResponse);

    expect(mockPostService.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.createPost).toHaveBeenCalledWith(
      createPostResLocals.nickname,
      createPostResLocals.userId,
      createPostRequestBodyParams.title,
      createPostRequestBodyParams.content
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "게시글 생성 성공",
    });
  });

  test("Posts Controller putPost Method by Success", async () => {
    const putPostRequestBody = {
      title: "Title_Success",
      content: "Content_Success",
    };
    const putPostRequestParams = {
      postId: 1,
    };
    const putPostResLocals = {
      userId: 1,
    };

    mockRequest.body = putPostRequestBody;
    mockRequest.params = putPostRequestParams;
    mockResponse.locals.user = putPostResLocals;

    const putPostReturnValue = { message: "게시글 수정 성공" };
    const putFindOnePostReturnValue = { userId: 1 };
    mockPostService.putPost = jest.fn(() => putPostReturnValue);
    mockPostService.findOnePost = jest.fn(() => putFindOnePostReturnValue);

    await postsController.putPost(mockRequest, mockResponse);

    expect(mockPostService.putPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.putPost).toHaveBeenCalledWith(
      putPostRequestBody.title,
      putPostRequestBody.content,
      putPostResLocals.userId,
      putPostRequestParams.postId
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "게시글 수정 성공",
    });
  });

  test("Posts Controller deletePost Method by Success", async () => {
    const deletePostRequestParams = {
      postId: 1,
    };
    const deletePostResLocals = {
      userId: 1,
    };

    mockRequest.params = deletePostRequestParams;
    mockResponse.locals.user = deletePostResLocals;

    const deletePostReturnValue = { message: "게시글 삭제 성공" };
    const deletFindOnePostReturnValue = { userId: 1 };
    mockPostService.deletePost = jest.fn(() => deletePostReturnValue);
    mockPostService.findOnePost = jest.fn(() => deletFindOnePostReturnValue);

    await postsController.deletePost(mockRequest, mockResponse);

    expect(mockPostService.deletePost).toHaveBeenCalledTimes(1);
    expect(mockPostService.deletePost).toHaveBeenCalledWith(
      deletePostRequestParams.postId,
      deletePostResLocals.userId
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "게시글 삭제 성공",
    });
  });
});
