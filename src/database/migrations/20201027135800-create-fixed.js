module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fixeds', {
      id: {
        type: Sequelize.INTEGER,
        alloyNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      day_of_week: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // 0: Inativo, 1 Ativo
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      court_id: {
        type: Sequelize.INTEGER,
        references: { model: 'courts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    return queryInterface.dropTable('fixeds');
  },
};
