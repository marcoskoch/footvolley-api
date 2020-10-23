import { isBefore, subHours } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Court from '../models/Court';

import CancellarionMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class CancelAppointmentService {
  async run({ appointment_id, user_id }) {
    const appointment = await Appointment.findByPk(appointment_id, {
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

    if (appointment.user_id !== user_id) {
      throw new Error("You don't have permission to cancel this appointment.");
    }

    const dateWithSub = subHours(appointment.date, 5);

    if (isBefore(dateWithSub, new Date())) {
      throw new Error('You can only cancel appointments 5 hours in advance.');
    }

    appointment.canceled_at = new Date();
    appointment.status = 2;

    await appointment.save();

    // await Queue.add(CancellarionMail.key, {
    //   appointment,
    // });

    return appointment;
  }
}

export default new CancelAppointmentService();
