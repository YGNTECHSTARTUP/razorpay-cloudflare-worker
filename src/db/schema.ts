import { integer, pgTable } from "drizzle-orm/pg-core";


export const paymentTable = pgTable("userpayment",
    {
        id:integer().generatedAlwaysAsIdentity().primaryKey(),
        userid:integer().notNull().unique(),
        amount:integer().notNull(),
    }
)