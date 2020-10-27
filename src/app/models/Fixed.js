import Sequelize, { Model } from 'sequelize';

class Fixed extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        day_of_week: Sequelize.STRING,
        time: Sequelize.STRING,
        status: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Court, { foreignKey: 'court_id', as: 'court' });
  }
}

export default Fixed;
