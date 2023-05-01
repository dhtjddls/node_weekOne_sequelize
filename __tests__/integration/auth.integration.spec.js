const supertest = require("supertest");
const app = require("../../app.js");
const { sequelize } = require("../../models/index.js");

// 통합 테스트(Integration Test)를 진행하기에 앞서 Sequelize에 연결된 모든 테이블의 데이터를 삭제합니다.
//  단, NODE_ENV가 test 환경으로 설정되어있는 경우에만 데이터를 삭제합니다.
beforeAll(async () => {
  if (process.env.NODE_ENV === "test") {
    await sequelize.sync();
  } else {
    throw new Error("NODE_ENV가 test 환경으로 설정되어 있지 않습니다.");
  }
});

describe("Layered Architecture Pattern, Auth Domain Integration Test", () => {
  test("POST /signup Test Success Case", async () => {
    const signupReqBody = {
      nickname: "devel12",
      password: "1234",
      confirm: "1234",
    };
    const response = await supertest(app)
      .post(`/signup`) // API의 HTTP Method & URL
      .send(signupReqBody); // Request Body
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ message: "회원 가입에 성공하였습니다." });
  });

  test("POST /login Test Success Case", async () => {
    const signupReqBody = {
      nickname: "devel12",
      password: "1234",
    };
    const response = await supertest(app)
      .post(`/login`) // API의 HTTP Method & URL
      .send(signupReqBody); // Request Body
    expect(response.status).toEqual(200);
  });

  test("로그인 안한 상태로 Post /posts", async () => {
    const response = await supertest(app).post("/posts").send({
      title: "안녕하세요 게시글 제목입니다.",
      content: "안녕하세요 content 입니다.",
    });
    expect(response.status).toEqual(403);
  });
});

// -> sequelize test_db는 바로 사용가능 하지만, redis는 test-db생성이 불가능함. -> redis-mock 모듈을 통해서 redis-mock 객체를 생성하여 test하여야함.
// describe("로그인 한 상태로 Post /posts", () => {
//   const agent = supertest.agent(app);
//   beforeEach(async () => {
//     await agent
//       .post("/signup")
//       .send({
//         nickname: "developer",
//         password: "1234",
//         confirm: "1234",
//       })
//       .expect(200);
//     await agent
//       .post("/login")
//       .send({
//         nickname: "developer",
//         password: "1234",
//       })
//       .expect(200);
//   });

//   test("로그인한 상태로 post 작성", (done) => {
//     agent
//       .post("/posts")
//       .send({
//         title: "안녕하세요 게시글 제목입니다.",
//         content: "안녕하세요 content 입니다.",
//       })
//       .expect(201, done);
//   });
// });

afterAll(async () => {
  // 통합 테스트가 완료되었을 경우 sequelize의 연결된 테이블들의 정보를 초기화합니다.
  if (process.env.NODE_ENV === "test") {
    await sequelize.sync({ force: true });
  } else {
    throw new Error("NODE_ENV가 test 환경으로 설정되어 있지 않습니다.");
  }
});
