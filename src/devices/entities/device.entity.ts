import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codes: string;

  @Column()
  reqCount?: number;
}
