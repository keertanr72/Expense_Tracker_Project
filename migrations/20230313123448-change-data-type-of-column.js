'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'phoneNumber', {
      type: Sequelize.BIGINT
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'phoneNumber', {
      type: Sequelize.INTEGER
    });
  }
};
