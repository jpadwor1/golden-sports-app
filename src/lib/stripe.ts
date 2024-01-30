import { PLANS } from '@/config/stripe';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { absoluteUrl } from './utils';

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
        country: accountData.country || 'US', // Default to US if not provided
        email: accountData.email,
        business_type: accountData.businessType || 'individual',
        business_profile: {
            mcc: accountData.mcc, // Merchant Category Code
            url: accountData.businessURL // Business URL
        },
        settings: {
            payments: {
                statement_descriptor: accountData.statementDescriptor // Statement descriptor
            }
        },
        tos_acceptance: { // Terms of Service acceptance
            ip: accountData.tosIP, // IP address of the user accepting the TOS
            date: Math.floor(Date.now() / 1000) // Current timestamp in seconds
        }
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

       // Create an account link for the user's Stripe account
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: absoluteUrl('/pilots/stripe/authorize'),
      return_url: absoluteUrl('/pilots/stripe/onboarded'),
      type: 'account_onboarding'
    });
  

    // Redirect to Stripe to start the Express onboarding flow
    redirect(accountLink.url);
  } catch (err) {
    console.log('Failed to create a Stripe account.');
    console.log(err);
  }




