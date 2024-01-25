module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'channel',
    {
      channel_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: '채널 아이디',
      },
      comunity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '커뮤니티 고유번호',
      },
      category_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '카테고리 코드',
      },

      channel_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '채널 이름',
      },

      user_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '최대인원',
      },
      channel_img_path: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '채널 이미지',
      },
      channel_desc: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        comment: '채널 설명',
      },
      channel_state_code: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '채널 상태 코드',
      },

      reg_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '등록일시',
      },
      reg_member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '등록자고유번호',
      },
      edit_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '등록일시',
      },

      edit_member_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '수정자 고유 번호',
      },
    },
    {
      sequelize,
      tableName: 'channel',
      timestamps: false,
      comment: '채널 정보',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'channel_id' }],
        },
      ],
    }
  );
};