import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { User } from "../user/user.entity";

@Entity({ name: 'items'})
export class Item {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column({ name: 'created_date'})
    createDate: Date

    @Column()
    deadline: Date

    @Column({ name: 'is_done'})
    isDone: boolean

    @Column({ name: 'finished_date', default: null})
    finishedDate: Date

    @ManyToOne(() => User)
    @JoinColumn({ name: 'owner_id'})
    owner: User
}