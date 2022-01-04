import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface TokenCreationAttrs {
  token: string;
  userId: number;
  expireAt: Date;
}

@Table({
  tableName: 'tokens',
})
export class Token extends Model<Token, TokenCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  token: string;

  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.DATE,
    unique: true,
    allowNull: false,
  })
  expireAt: Date;
}
