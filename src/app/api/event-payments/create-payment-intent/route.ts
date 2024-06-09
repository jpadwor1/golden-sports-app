import { stripe } from '@/lib/stripe';
import { db } from '@/db';

export async function POST(request: Request, response: Response) {
  const body = await request.json();
  const coach = await db.user.findFirst({
    where: {
      id: body.coachId,
    },
  })

  if (!coach) {
    console.log('Coach not found');
    return new Response('Coach not found', { status: 404 });
  }

  if (coach.stripeAccountId === null) {
    console.log('Coach does not have a stripe account');
    return new Response('Coach does not have a stripe account', { status: 400 });
  }


    try {

      const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: body.feeAmount * 100,
        product_data: {
          name: body.eventTitle,
        },
      });

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: 123,
          transfer_data: {
            destination: coach.stripeAccountId,
          },
        },
        ui_mode: 'embedded',
        redirect_on_completion: 'never',
      });
      return new Response(session.client_secret, { status: 200 });
    } catch (e: any) {
      return new Response(e.message, { status: 400 });
    }
   
  
}