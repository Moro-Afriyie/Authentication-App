import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	name?: string;

	@Column('text', { nullable: true })
	bio?: string;

	@Column({ nullable: true })
	email?: string;

	@Column({ nullable: true })
	photo?: string;

	@Column({ nullable: true })
	phoneNumber?: string;

	@Column({ nullable: true })
	password?: string;

	@Column({ nullable: true })
	provider?: string;

	@Column({ nullable: true })
	providerId?: string;
}
