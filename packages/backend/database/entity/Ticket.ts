import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Ticket {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   siteName: string;

   @Column()
   priority: number;

   @Column()
   address: string;

   @Column()
   city: string;

   @Column()
   ticketNumber: string;

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
