import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity({ name: 'invalidated_token'})
export class InvalidatedToken {
    @PrimaryColumn()
    uuid: string

    @ManyToOne(type => User)
    @JoinColumn({ name: 'owner_id' })
    onwer: User
}