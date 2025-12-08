import {
  IsIn,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsDateString,
} from 'class-validator';

/**
 * Data Transfer Object for creating a reservation.
 */
export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('TN')
  clientPhone: string;

  @IsNotEmpty()
  @IsDateString()
  visitDate: string;

  @IsNotEmpty()
  @IsString()
  visitTime: string;

  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'cancelled'])
  status: string;
}
