const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db'); // must export your Sequelize instance

const Reservation = sequelize.define(
  'Reservation',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    equipmentId: { type: DataTypes.INTEGER, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    purpose: { type: DataTypes.STRING(300), allowNull: true },
    status: {
      type: DataTypes.ENUM('active', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    tableName: 'reservations',
    timestamps: true,
    indexes: [{ fields: ['equipmentId', 'status', 'startDate', 'endDate'] }],
    validate: {
      endNotBeforeStart() {
        if (this.endDate < this.startDate) throw new Error('endDate must be on or after startDate');
      },
    },
  }
);

module.exports = Reservation;