import Court from '../models/Court';

class AdressController {
  async index(req, res) {
    const courts = await Court.findAll({
      where: { provider_id: req.params.providerId },
    });

    return res.json(courts);
  }

  async store(req, res) {
    const { name, price } = req.body;

    const court = await Court.create({
      provider_id: req.userId,
      name,
      price,
    });

    return res.json(court);
  }

  async delete(req, res) {
    const court = await Court.findByPk(req.params.id);

    await court.destroy();

    return res.json({ court_id: req.params.id });
  }
}

export default new AdressController();
