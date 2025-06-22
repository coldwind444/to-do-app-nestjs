import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn()
    oid: number

    @Column()
    code: number

    @Column({ name: 'reset_token', default: null })
    resetToken: string

    @Column()
    expire: Date

    @OneToOne(t => User)
    @JoinColumn({ name: 'user_id' })
    owner: User
}