import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { BaseEntity } from "../base/entity/base.entity";

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;
}
