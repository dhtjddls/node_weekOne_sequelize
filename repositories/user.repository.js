class UserRepository {
  constructor(userModel) {
    this.User = userModel;
  }
  createUser = async (nickname, password, confirm) => {
    // ORM인 Sequelize에서 Posts 모델의 create 메소드를 사용해 데이터를 요청합니다.
    const createPostData = await this.User.create({
      nickname,
      password,
    });

    return createPostData;
  };

  findOneUser = async (nickname) => {
    const findOneUserData = await this.User.findOne({
      where: { nickname: nickname },
    });
    return findOneUserData;
  };
}

module.exports = UserRepository;
