# Next Typescript Template
This is a Next Typescript Template using Kysely for DB Queries and Database Migrations

## How to start

### Copy the .env.template and fill the DATABASE_URL with yuor connection string
```
cp .env.template .env.local
```

```
DATABASE_URL=mysql://username:password@yourdomain.com/database
```

### Create a temporary database type at `src/database/types.d.ts

```
export type DB = {
    tasks: {
        id: string,
        title: string,
        description: string,
        completed: boolean,
        created_at: Date,
        updated_at: Date
    }
}
```


### Generate a migration file via kysely-ctl, the script is already in the package.json

```
yarn make:migrate <name>
```

This will create a migration file at `~/src/database/migrations`. Here is an example script in creating a table named 'tasks'

```
export async function up(db: Kysely<DB>): Promise<void> {
  // up migration code goes here...
  await db.schema
    .createTable('tasks')
    .addColumn('id', 'varchar(36)', (col) => col.primaryKey().defaultTo(sql`UUID()`))
    .addColumn('title', 'varchar(60)', (col) => col.notNull())
    .addColumn('description', 'varchar(255)', (col) => col.notNull())
    .addColumn('completed', 'boolean', (col) => col.defaultTo(false))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
}

export async function down(db: Kysely<DB>): Promise<void> {
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
  await db.schema.dropTable('tasks').execute();
}
```

Run the migrate command to update the database

```
yarn migrate
```

### Generating Types Via Kysely
We will now override our temporary database type with the generated types by Kysely, to do this run the command:

```
yarn kysely:generate
```

This will overwrite types.d.ts with the new types that we will use.
> Double check if some types are incorrect. For instance in MySQL, boolean are transformed into number because booleans are saved as tinyint.

### Seeding your database (Optional)

```
yarn make:seed <name>
```

This will create a seed file at `~/src/database/seeds`. Here is an example script in populating the table 'tasks'

```
export async function seed(db: Kysely<DB>): Promise<void> {
  // seed code goes here...
  // note: this function is mandatory. you must implement this function.
  await db
    .insertInto('tasks')
    .values([
      {
        title: 'My first task',
        description: 'My first task description',
      },
      {
        title: 'My second task',
        description: 'My second task description',
        completed: true,
      },
      {
        title: 'My third task',
        description: 'My third task description',
      },
    ])
    .execute();
}
```

Run the seed comand to populate the database

```
yarn seed
```

### That is all with the Kysely ORM tool!
