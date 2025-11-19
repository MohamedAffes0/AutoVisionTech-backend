import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CarEntity } from '../car/car.entity';
import { IsEmail } from 'class-validator';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({nullable: false})
  clientName: string;

  @IsEmail()
  @Column({nullable: false})
  clientEmail: string;

  @Column({nullable: false})
  clientPhone: string;

  @Column({ type: 'date' , nullable: false })
  visitDate: Date;

  @Column({ type: 'time' , nullable: false })
  visitTime: string;

  @Column({ nullable: false })
  status: string;

  @ManyToOne(() => CarEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'carId' })
  product: CarEntity;
}
