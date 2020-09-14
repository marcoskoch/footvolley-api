import Adress from '../models/Adress';

class AdressController {
  async index(req, res) {
    const adress = await Adress.findOne({
      where: { provider_id: req.userId },
    });

    return res.json(adress);
  }

  async store(req, res) {
    const { street_adress, number, city, state, country, zip_code } = req.body;

    const adress = await Adress.create({
      provider_id: req.userId,
      street_adress,
      number,
      city,
      state,
      country,
      zip_code,
    });

    return res.json(adress);
  }
}

export default new AdressController();
