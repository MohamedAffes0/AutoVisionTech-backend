import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';

import { User } from 'src/modules/user/user.entity';
import { CarEntity } from '../car/car.entity';
@Entity('comments')
export class CommentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false })
  content: string;

  @Check(`"mark" BETWEEN 1 AND 5`)
  @Column({ nullable: false })
  mark: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => CarEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'carId' })
  product: CarEntity;
}
