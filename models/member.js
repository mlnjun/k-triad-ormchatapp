// 일반사용자 정보 : 사용자 채팅 웹사이트의 회원가입시 여기에 등록
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'member',
    {
      member_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: '사용자고유번호',
      },
      email: { type: DataTypes.STRING(100), allowNull: false, comment: '사용자 이메일주소' },
      member_password: { type: DataTypes.STRING(500), allowNull: false, comment: '사용자계정암호' },
      name: { type: DataTypes.STRING(100), allowNull: false, comment: '관리자이름' },
      profile_img_path: { type: DataTypes.STRING(300), allowNull: false, comment: '프로필이미지경로' },
      telephone: { type: DataTypes.STRING(300), allowNull: false, comment: '전화번호' },
      entry_type_code: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '가입유형코드 1:구글 2:페이스북 3:카카오',
      },
      use_state_code: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '이용상태코드 0:허용대기 1:활동중 2:탈퇴처리',
      },
      birth_date: { type: DataTypes.STRING(6), allowNull: true, comment: '생년월일' },
      reg_date: { type: DataTypes.DATE, allowNull: false, comment: '등록일시' },
      reg_member_id: { type: DataTypes.INTEGER, allowNull: false, comment: '등록자고유번호' },
      edit_date: { type: DataTypes.DATE, allowNull: true, comment: '수정일시' },
      edit_member_id: { type: DataTypes.INTEGER, allowNull: true, comment: '수정자고유번호' },
    },
    {
      sequelize,
      tableName: 'member',
      timestamps: false,
      comment: '일반사용자 정보 : 사용자 채팅 웹사이트의 회원가입시 여기에 등록',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'member_id' }],
        },
      ],
    },
  );
};
