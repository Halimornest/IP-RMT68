'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('topics', 'subject', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'general',
    });

    await queryInterface.addColumn('topics', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('topics', 'subject');
    await queryInterface.removeColumn('topics', 'user_id');
  },
};
