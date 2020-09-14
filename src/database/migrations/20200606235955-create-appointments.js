module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        alloyNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // 1 : Requested, 2 Cancelled, 3 Confirmed, 4 Completed, 5 No-Show
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      court_id: {
        type: Sequelize.INTEGER,
        references: { model: 'courts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      canceled_at: {
        type: Sequelize.DATE,
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

  down: queryInterface => {
    return queryInterface.dropTable('appointments');
  },
};
