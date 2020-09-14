import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Ticket {
   @PrimaryColumn()
   ticketNumber: string;

   @Column()
   siteName: string;

   @Column()
   priority: number;

   @Column()
   address: string;

   @Column()
   city: string;

   @Column()
   partNumber: string;

   @Column()
   partDescription: string;

   @Column()
   created: Date;

   @Column()
   longitude: number;

   @Column()
   latitude: number;
}
