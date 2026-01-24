'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quizzes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      topic_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'topics',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      questions: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      total_questions: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('quizzes');
  },
};
