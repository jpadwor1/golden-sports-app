import { stripe } from '@/lib/stripe';
import { db } from '@/db';

export async function POST(request: Request, response: Response) {
  const body = await request.json();
  if (body.selected === 'one-time') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: body.donationAmount * 100,
        automatic_payment_methods: { enabled: true },
        metadata: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          donationAmount: body.donationAmount,
        },
      });

      return new Response(paymentIntent.client_secret, { status: 200 });
    } catch (e: any) {
      return new Response(e.message, { status: 400 });
    }
  } else {
    try {
      const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: body.donationAmount * 100,
        recurring: {
          interval: 'month',
        },
        product: 'prod_PoN4BwwtYp84kO',
      });

      const customer = await stripe.customers.create({
        email: body.email,
        name: body.firstName + ' ' + body.lastName,
        address: {
          line1: body.address.street,
          city: body.address.city,
          state: body.address.state,
          postal_code: body.address.zip,
        },
      });

      const dbCustomer = await db.user.findFirst({
        where: {
          email: body.email,
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: price.id,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          donationAmount: body.donationAmount,
        },
      });

      if (dbCustomer) {
        await db.user.update({
          where: {
            email: body.email,
          },
          data: {
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id,
            stripePriceId: price.id,
          },
        });
      }

      if (subscription) {
        return new Response(JSON.stringify(subscription), { status: 200 });
      }
    } catch (error: any) {
      return new Response(error.message, { status: 400 });
    }
  }
}