import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1724234842688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'users',
      columns: [
        {
          name: 'user_id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
        },
        {
          name: 'username',
          type: 'varchar',
        },
        {
          name: 'password',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    });
    queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('users');
  }
}
