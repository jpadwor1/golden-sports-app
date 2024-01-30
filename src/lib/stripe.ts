import { PLANS } from '@/config/stripe';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
  typescript: true,
});


export async function createStripeAccount(accountData){
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if(!user?.id){
    redirect('/sign-in')
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id
    }
  })

  if(!dbUser){
    redirect('/auth-callback/?origin=/dashboard')
  }

  try {
    let accountId = dbUser.stripeAccountId;

    // Create a Stripe account for this user if one does not exist already
    if (accountId == undefined) {
      // Define the parameters to create a new Stripe account with
      let accountParams = {
        type: 'express',
        country: accountData.country || undefined,
        email: accountData.email || undefined,
        business_type: accountData.type || 'individual', 
      }
  
      // Companies and invididuals require different parameters
      if (accountParams.business_type === 'company') {
        accountParams = Object.assign(accountParams, {
          company: {
            name: accountData.businessName || undefined
          }
        });
      } else {
        accountParams = Object.assign(accountParams, {
          individual: {
            first_name: accountData.firstName || undefined,
            last_name: accountData.lastName || undefined,
            email: accountData.email || undefined
          }
        });
      }
  
      const account = await stripe.accounts.create(accountParams);
      accountId = account.id;

      // Update the model and store the Stripe account ID in the accountDatastore:
      // this Stripe account ID will be used to issue payouts to the pilot
      db.user.update({
        where: {
          id: dbUser.id
        },
        data: {
          stripeAccountId: accountId
        }
      })
    }




}