import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import Court from '../models/Court';
import User from '../models/User';
import File from '../models/File';

import CreateAppointmentService from '../services/CreateAppointmentService';
import CancelAppointmentService from '../services/CancelAppointmentService';

class AppointmentController {
  async index(req, res) {
    const { page = 1, status = 1 } = req.query;

    console.log(status);

    const courts = await Court.findAll({
      where: { provider_id: req.userId },
      attributes: ['id'],
    });

    const filterCourts = courts.map(court => {
      return court.id;
    });

    const now = new Date();

    const appointments = await Appointment.findAll({
      where: {
        court_id: {
          [Op.in]: filterCourts,
        },
        date: {
          [Op.gte]: now,
        },
        canceled_at: null,
        status,
      },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Court,
          as: 'court',
          attributes: ['name'],
        },
      ],
    });

    return res.json(appointments);
  }

  async list(req, res) {
    const { page = 1, status = 1 } = req.query;

    const now = new Date();

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        date: {
          [Op.gte]: now,
        },
        canceled_at: null,
        status,
      },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Court,
          as: 'court',
          attributes: ['name'],
          include: [
            {
              model: User,
              as: 'provider',
              attributes: ['id', 'name'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['id', 'path', 'url'],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const { date, court_id } = req.body;

    const appointment = await CreateAppointmentService.run({
      user_id: req.userId,
      court_id,
      date,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await CancelAppointmentService.run({
      provider_id: req.params.id,
      user_id: req.userId,
    });

    return res.json(appointment);
  }

  async confirm(req, res) {
    const { status = 1 } = req.query;

    const appointment = await Appointment.findByPk(req.params.id);

    appointment.status = status;

    await appointment.save();

    return res.json(appointment);
  }
}

export default new AppointmentController();
