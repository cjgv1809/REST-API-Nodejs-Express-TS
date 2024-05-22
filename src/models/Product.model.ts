import { Table, Model, Column, DataType, Default } from "sequelize-typescript";

// decorator @Table is used to define the table name
@Table({
  tableName: "products",
})
class Product extends Model {
  // decorator @Column is used to define the column name, type and constraints
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare availability: boolean;
}

export default Product;
