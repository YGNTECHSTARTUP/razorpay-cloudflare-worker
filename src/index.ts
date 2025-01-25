import { Hono } from 'hono'
import { fetchApiResponse} from './constant'
import { env } from 'hono/adapter'
import { drizzle, NeonHttpDatabase} from 'drizzle-orm/neon-http'
import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import {  campaigns, paymentTable} from './db/schema'
import { eq } from 'drizzle-orm/expressions'
import { count, sum } from 'drizzle-orm'
import { bearerAuth } from 'hono/bearer-auth'
import { cors } from 'hono/cors'
declare module "hono"{
  interface ContextVariableMap{
    db:NeonHttpDatabase<Record<string, never>> & {
      $client: NeonQueryFunction<false, false>;
  }
  }
}

const app = new Hono();
app.use("*", cors({
  origin: ["https://iskcon-hubli.vercel.app","http://localhost:3000/"],
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
  allowMethods: ['POST', 'GET', 'OPTIONS','PUT','DELETE'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))
const token = "iskonhublicampaign";
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
const { DATABSE_URL } = env<{
  DATABSE_URL: string;
}>(c);
const { AUTH_TOKEN } = env<{
  AUTH_TOKEN: string;
}>(c);
  const sql = neon(DATABSE_URL);
  c.set('db', drizzle(sql)); 
  await next();
  }catch(err){
    console.error("An error occurred while connecting to the database:", err);
  }
 
});

app.get("/campaign/:id", async (c) => {
  const db = c.get("db");
  const campaignId = Number(c.req.param("id"));

  // Validate campaignId
  if (isNaN(campaignId)) {
    return c.json({
      error: "Invalid campaign ID",
      status: 400,
    });
  }

  try {
    const campaignDetails = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId));

    if (campaignDetails.length === 0) {
      return c.json({
        error: "Campaign not found",
        status: 404,
      });
    }

    const totalFundersResult = await db
      .select({ count: count(campaigns.id) })
      .from(campaigns)
      .where(eq(campaigns.id, campaignId));

    const totalFunders = totalFundersResult[0]?.count || 0;

    const raisedFundResult = await db
      .select({ sum: sum(paymentTable.amount) })
      .from(paymentTable)
      .where(eq(paymentTable.campaignsid, campaignId));

    const raisedFund = raisedFundResult[0]?.sum || 0;

    return c.json({
      campaignDetails: campaignDetails[0], 
      totalFunders,
      raisedFund,
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json({
      error: "An error occurred while fetching campaign data",
      status: 500,
    });
  }
});


app.post('/create-payment', bearerAuth({ token }), async (c) => {
  const db = c.get('db');
  const body = await c.req.json();

  try {
    const userid = Number(body.userid);
    const amount = Number(body.amount);
    const username = body.username ? String(body.username) : null; // Optional field
    const campaignsid = Number(body.campaignsid);

    console.log("Received values:", { userid, amount, username, campaignsid });

    // Validate userid and amount are numbers
    if (isNaN(userid) || isNaN(amount)) {
      return c.json(
        {
          error: "Invalid values for 'userid' or 'amount'.",
          status: 400,
        },
        400
      );
    }

    // Validate campaignsid if provided
    if (campaignsid) {
      const campaignExists = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.id, campaignsid))
        .limit(1).execute();
        console.log(campaignExists)

      if (!Array.isArray(campaignExists) || campaignExists.length === 0) {
        return c.json(
          {
            error: "Invalid 'campaignsid'. Campaign does not exist.",
            status: 400,
          },
          400
        );
      }
    }

    const result = await db
      .insert(paymentTable)
      .values({
        userid,
        amount,
        username,
        campaignsid,
      });

    return c.json(
      {
        message: "Payment created successfully",
        status: 201,
      },
      201
    );
  } catch (error) {
    console.error(error); 
    return c.json(
      {
        error: "Failed to create payment",
        status: 500,
      },
      500
    );
  }
});








app.get("/showcampaigns", async (c) => {
  try{
    const db = c.get("db");
  
    const campaignsData = await db.select().from(campaigns);
  
  
    const campaignDetails = await Promise.all(
      campaignsData.map(async (campaign) => {
        const totalfunders = await db
          .select({
            count: count(paymentTable.id)
          })
          .from(paymentTable)
          .where(eq(paymentTable.campaignsid, campaign.id)); 
        
        const funders = totalfunders[0].count;
  
        const raised = await db
          .select({ sum: sum(paymentTable.amount) })
          .from(paymentTable)
          .where(eq(paymentTable.campaignsid, campaign.id)); 
        
        const raisedtotal = raised[0].sum;
  
        return {
          campaignId: campaign.id,
          campaignName: campaign.campaignName,
          totalFunderCount: funders,
          totalRaisedAmount: raisedtotal,
          imgurl:campaign.imgurl
        };
      })
    );
  
    return c.json(campaignDetails);
  }
catch(e){
  return c.json({
    error:"Failed to fetch the details",
    status:404
  })
}
}

);

app.delete('/delete-campaign/:id',bearerAuth({ token }), async (c) => {
  const db = c.get('db');
  const campaignId = Number(c.req.param('id'));

  if (isNaN(campaignId)) {
    return c.json({
      error: "Invalid campaign ID",
      status: 400,
    });
  }

  try {
    const existingCampaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);

    if (existingCampaign.length === 0) {
      return c.json({
        error: "Unable to delete. Campaign does not exist.",
        status: 404,
      });
    }

    const result = await db.delete(campaigns).where(eq(campaigns.id, campaignId));

    if (!result) {
      return c.json({
        error: "Failed to delete the campaign. No rows were affected.",
        status: 400,
      });
    }

    return c.json({
      message: "Campaign deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json({
      error: "Failed to process the request",
      status: 500,
    });
  }
});



app.put('/update-campaign/:id',bearerAuth({ token }), async (c) => {
  const db = c.get('db');
  const body = await c.req.json();
  const campaignId = Number(c.req.param('id'));

  // Validate campaignId
  if (isNaN(campaignId)) {
    return c.json({
      error: "Invalid campaign ID",
      status: 400,
    });
  }

  // Validate body fields
  if (!body.campaignname || !body.description || isNaN(Number(body.targetamount)) || isNaN(Number(body.days))) {
    return c.json({
      error: "All fields are required and must be valid",
      status: 400,
    });
  }

  const campaignData = {
    campaignName: String(body.campaignname),
    description: String(body.description),
    targetAmount: Number(body.targetamount),
    days: Number(body.days),
  };
  console.log(campaignData)

  try {
    // Check if the campaign exists before updating
    const existingCampaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);

    if (existingCampaign.length === 0) {
      return c.json({
        error: "Campaign not found",
        status: 404,
      });
    }

    // Update the campaign
    const result = await db
      .update(campaigns)
      .set(campaignData)
      .where(eq(campaigns.id, campaignId));

    if (!result) {
      return c.json({
        error: "No changes applied to the campaign",
        status: 400,
      });
    }

    return c.json({
      message: "Campaign updated successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json({
      error: "Failed to process the request",
      status: 500,
    });
  }
});




app.post('/create-campaign',bearerAuth({ token }), async (c) => {
  const db = c.get('db');
  const body = await c.req.json();
  try{
    const campaignData = {
      campaignName: String(body.campaignname),
      description: String(body.description),
      targetAmount: Number(body.targetamount),
      days: Number(body.days),
      imgurl: String(body.imgurl), 
      // img:body['file'] -- cloudflare r2 is not ready yet or need to find any alternative
    };
    if(!campaignData.campaignName || !campaignData.description || !campaignData.targetAmount ||!campaignData.days){
      return c.json({
        error:"All fields are required",
        status:400
      })
    }

    const existingCampaign = await db.select().from(campaigns).where(eq(campaigns.campaignName, campaignData.campaignName)).limit(1);

    if (existingCampaign.length > 0) {
      return c.json({
        error: "Campaign already exists",
        status: 400
      });
    }
  
    try{
      const result = await db.insert(campaigns).values(campaignData);
      return c.json({
        message: "Campaign created successfully",
        status: 201,
      });
    }
    catch{
      return c.json({
        error:"Failed to Update in the Database",
        status:502
      })
    }
  }
  catch(e){
    return c.json({
      error:"Failed to parse the statement",
      status:400
    })
  }
 
});



app.get('/', (c) => {
  return c.text('Hello! Enter the Valid Api Endpoint')
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
  










});
export default app
