import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';

import { User } from 'src/modules/user/user.entity';
@Entity('cars')
export class CarEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ nullable: false })
    brand: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: false })
    model: string;

    @Column({ nullable: false })
    year: number;

    @Column({ nullable: false })
    price: number;

    @Column({ nullable: false })
    kilometerAge: number;

    @Column({ nullable: false })
    status: string;

    @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: User;
}
