import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import Fixed from '../models/Fixed';

class AvailableService {
  async run({ date, court_id }) {
    const appointments = await Appointment.findAll({
      where: {
        court_id,
        canceled_at: null,
        status: {
          [Op.in]: [1, 3],
        },
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    const dayWeek = format(date, 'iii');

    const fixeds = await Fixed.findAll({
      attributes: ['time'],
      where: {
        court_id,
        day_of_week: dayWeek,
        status: 1,
      },
    });

    const isWeekEnd = dayWeek === 'Sat' || dayWeek === 'Sun';

    const schedule = isWeekEnd
      ? [
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
        ]
      : [
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
          '20:00',
          '21:00',
          '22:00',
          '23:00',
        ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(setMinutes(setHours(date, hour), minute), 0);

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time) &&
          !fixeds.find(f => f.time === time),
      };
    });

    return available;
  }
}

export default new AvailableService();
