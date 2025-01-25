import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";


export const paymentTable = pgTable("userpayment",
    {
        id:integer().generatedAlwaysAsIdentity().primaryKey(),
        userid:integer().notNull(),
        amount:integer().notNull(),
        username:text("username"),
        campaignsid:integer("campaign_id").references(()=>campaigns.id)
    }
)
export const campaigns = pgTable('campaigns', {
    id: serial('id').primaryKey(),
    campaignName: varchar('campaign_name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    targetAmount: integer('target_amount').notNull(),
    days: integer('days').notNull(),
    imgurl:varchar('image_url',{length:255}),
  });


  export const campaignRelation = relations(campaigns, ({ many }) => ({
    payment: many(paymentTable), 
  }));
  
  export const paymentRelation = relations(paymentTable, ({ one }) => ({
    campaign: one(campaigns),
  }));
  

