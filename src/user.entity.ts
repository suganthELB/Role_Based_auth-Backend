//User entity to connect the database and backend nest js
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class User {

//databse connection
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    is_admin: number;
}