import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "ticket" })
export class TicketEntity {
   @PrimaryColumn()
   ticketNumber: string;

   @Column({ nullable: true })
   siteName: string;

   @Column()
   priority: string;

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

   @Column({ type: "float" })
   longitude: number;

   @Column({ type: "float" })
   latitude: number;
}
