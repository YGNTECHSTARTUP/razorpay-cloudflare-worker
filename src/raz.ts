// import { Hono } from 'hono'
// import { cors } from 'hono/cors'
// import { jwt } from 'hono/jwt'
// import Razorpay from 'razorpay'

// const app = new Hono()

// app.use(cors())
// app.use('/api/*', jwt({ secret: process.env.JWT_SECRET as string }))

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID as string,
//   key_secret: process.env.RAZORPAY_KEY_SECRET as string,
// })

// let users: { [key: string]: { id: string, email: string, referralCode: string, balance: number, referredBy?: string } } = {}

// function generateReferralCode(): string {
//   return Math.random().toString(36).substring(2, 8).toUpperCase()
// }

// app.post('/register', async (c) => {
//   const { email } = await c.req.json()
//   const id = Math.random().toString(36).substring(2, 15)
//   const referralCode = generateReferralCode()
//   users[id] = { id, email, referralCode, balance: 0 }
//   const token = await jwt.sign({ id }, process.env.JWT_SECRET as string)
//   return c.json({ token, user: users[id] })
// })

// app.get('/api/user', async (c) => {
//   const userId = c.get('jwtPayload').id
//   return c.json(users[userId])
// })

// app.post('/api/create-order', async (c) => {
//   const { amount } = await c.req.json()
//   const options = {
//     amount: amount * 100, 
//     currency: 'INR',
//     receipt: 'receipt_' + Math.random().toString(36).substring(2),
//   }
//   const order = await razorpay.orders.create(options)
//   return c.json(order)
// })

// app.post('/api/verify-payment', async (c) => {
//   const { orderId, paymentId, signature } = await c.req.json()
//   const userId = c.get('jwtPayload').id

//   const isValid = verifyPaymentSignature(orderId, paymentId, signature)

//   if (isValid) {
//     const order = await razorpay.orders.fetch(orderId)
//     const amount = order.amount / 100 

//     users[userId].balance += amount

//     if (users[userId].referredBy) {
//       const referrerId = users[userId].referredBy
//       users[referrerId].balance += amount * 0.1 
//     }

//     return c.json({ success: true, balance: users[userId].balance })
//   } else {
//     return c.json({ success: false, message: 'Invalid payment signature' }, 400)
//   }
// })

// app.post('/api/apply-referral', async (c) => {
//   const { referralCode } = await c.req.json()
//   const userId = c.get('jwtPayload').id

//   const referrer = Object.values(users).find(user => user.referralCode === referralCode)

//   if (referrer && referrer.id !== userId) {
//     users[userId].referredBy = referrer.id
//     return c.json({ success: true, message: 'Referral code applied successfully' })
//   } else {
//     return c.json({ success: false, message: 'Invalid referral code' }, 400)
//   }
// })

// export default app

