import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationEntity } from './reservation.entity';
import { CarEntity } from '../car/car.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationFilterDto } from './dto/reservation-filter.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
  ) {}

  applyFilters(
    qb: SelectQueryBuilder<ReservationEntity>,
    filters: ReservationFilterDto,
  ): void {
    if (filters.clientPhone) {
      qb.andWhere('LOWER(reservation.clientPhone) LIKE :clientPhone', {
        clientPhone: `%${filters.clientPhone.toLowerCase()}%`,
      });
    }

    if (filters.status) {
      qb.andWhere('reservation.status = :status', {
        status: filters.status,
      });
    }

    if (filters.carId) {
      qb.andWhere('reservation.carId = :carId', {
        carId: filters.carId,
      });
    }

    if (filters.minVisitDate) {
      qb.andWhere('reservation.visitDate >= :minVisitDate', {
        minVisitDate: filters.minVisitDate,
      });
    }

    if (filters.maxVisitDate) {
      qb.andWhere('reservation.visitDate <= :maxVisitDate', {
        maxVisitDate: filters.maxVisitDate,
      });
    }
  }

  //retrieve all reservations with filters and pagination
  async findAll(
    page: number,
    limit: number,
    filters: ReservationFilterDto,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const qb = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.car', 'car')
      .groupBy('reservation.id')
      .addGroupBy('car.id');

    //Apply filters
    this.applyFilters(qb, filters);

    if (filters.sortByVisitDate) {
      qb.orderBy(
        'reservation.visitDate',
        filters.sortByVisitDate.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    // Count
    const countQb = qb.clone();
    const totalItems = (await countQb.getRawMany()).length;

    // Pagination
    qb.skip(skip).take(limit);

    const reservations = await qb.getMany();

    return {
      items: reservations,
      meta: {
        totalItems,
        itemCount: reservations.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  //find a reservation by id
  async findOne(id: string): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['car'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  //create a reservation
  async createReservation(
    reservationData: CreateReservationDto,
    carId: string,
  ): Promise<ReservationEntity> {
    const car = await this.carRepository.findOneBy({ id: carId });

    if (!car) {
      throw new NotFoundException('Car Not Found');
    }

    const reservation = this.reservationRepository.create({
      ...reservationData,
      carId,
    });

    return this.reservationRepository.save(reservation);
  }

  //update a reservation
  async updateReservation(
    id: string,
    dto: UpdateReservationDto,
  ): Promise<ReservationEntity | null> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const updateData = {
      ...dto,
      updatedAt: new Date(),
    };

    await this.reservationRepository
      .createQueryBuilder()
      .update(ReservationEntity)
      .set(updateData)
      .where('id = :id', { id })
      .execute();

    return this.reservationRepository.findOne({
      where: { id },
      relations: ['car'],
    });
  }

  //delete a reservation
  async deleteReservation(id: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    await this.reservationRepository.delete(id);

    return { message: 'Reservation deleted successfully' };
  }
}
