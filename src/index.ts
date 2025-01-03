import { Hono } from 'hono'
import { fetchApiResponse} from './constant'
import { env } from 'hono/adapter'
import { drizzle, NeonHttpDatabase} from 'drizzle-orm/neon-http'
import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { paymentTable} from './db/schema'
import { eq } from 'drizzle-orm/expressions'
declare module "hono"{
  interface ContextVariableMap{
    db:NeonHttpDatabase<Record<string, never>> & {
      $client: NeonQueryFunction<false, false>;
  }
  }
}
const app = new Hono()
const fetchPayment = async () => {
  try {
    const response = await fetchApiResponse();
  
    if ("error" in response) {
      return {
       status : "error",
       error: response.error
      }
    } else {
      return  {
        status : response.status,
        amount: response.amount,
        amount_paid:response.amount_paid
      }
      
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
}

app.use('*', async (c, next) => {
  try {
 console.log("Context:",c)
const { DATABSE_URL } = env<{
  DATABSE_URL: string;
}>(c);
  console.log(DATABSE_URL)
  const sql = neon(DATABSE_URL);
  c.set('db', drizzle(sql)); 
  await next();
  }catch(err){
    console.error("An error occurred while connecting to the database:", err);
  }
 
});




app.get('/', (c) => {
  return c.text('Hello! There are 2 Routes /payment?userid and /user:id')
})

app.get("/user/:id", async (c)=> {
 
const id = c.req.param("id");
if (id === undefined) {
  return c.json({
    error: "User ID is required",
    status: "error",
  })}
  const db = c.get('db');
  const amt = await db.select({amount:paymentTable.amount}).from(paymentTable).where(eq(paymentTable.userid,Number(id))).then((res)=>res[0]?.amount ?? 0);
  return c.json({
    userid:id,
    amount:amt
  })
});

app.get("/show", async (c)=> {
  const db = c.get('db');
  const res = await db.select().from(paymentTable).then((res)=>res);
  return c.json(res)
})



app.get("/payment", async (c)=>{
  const id = c.req.query("userid");
  if (id === undefined) {
    return c.json({
      error: "User ID is required",
      status: "error",
    })
  }
  else {
    const db = c.get('db');
  try {
    const res = await fetchPayment().then((rese)=>rese);
    if (res?.status === "error") {
      return c.json({
        error: res.error,
        status: res.status,
      });
    } else {
      try {
      
            if ((res?.amount_paid ?? 0) > 0){
              const userexist = await db.select().from(paymentTable).where(eq(paymentTable.userid, Number(id))).then((res) => res.length > 0);
              if (userexist) {
                const previousamt = await db.select({ amount: paymentTable.amount }).from(paymentTable).where(eq(paymentTable.userid, Number(id))).then((res) => res[0]?.amount ?? 0);
                const newamt = previousamt + Number(res?.amount_paid);
                await db.update(paymentTable).set({ amount: newamt }).where(eq(paymentTable.userid, Number(id))).then((res) => res);
              } else {
                const userPayment:typeof paymentTable.$inferInsert = {
                  userid: Number(id),
                  amount: Number(res?.amount_paid)
                }
                await db.insert(paymentTable).values(userPayment).then((res) => res);
              }
            }
            else {
              return c.json({
                error: "No payment to update",
                status: "error",
              });
            }
        
      }
      catch(err){
            return c.json({
              error: "An error occurred while updating the database",
              status: "error",
              code:"502"
             })
      }
     
    }
  }
  catch(err){
   return c.json({
    error: "An error occurred while fetching payment",
    status: "error",
    code:"502"
   })
  }
    
    return c.json({
      status: "success",
      message: "Payment updated successfully",
    })
  }
  









app.get('/hello', () => new Response('This is /hello'))

});
export default app
