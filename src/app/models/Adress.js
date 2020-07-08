import Sequelize, { Model } from 'sequelize';

class Adress extends Model {
  static init(sequelize) {
    super.init(
      {
        street_adress: Sequelize.STRING,
        number: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        country: Sequelize.STRING,
        zip_code: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Adress;
