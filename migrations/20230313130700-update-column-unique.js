'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'email', {
      unique: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'email', {
      unique: false
    });
  }
};

