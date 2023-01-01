import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column('text')
	bio: string;

	@Column({
		unique: true,
	})
	email: string;

	@Column()
	photo: string;

	@Column()
	phoneNumber: string;

	@Column()
	password: string;

	@Column()
	provider: string;
}
