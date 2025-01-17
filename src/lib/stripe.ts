import { db } from "@/db";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { absoluteUrl } from "./utils";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});

export async function createStripeAccount(userId: string) {
  if (userId) {
    redirect("/sign-in");
  }

  const dbUser = await db.member.findUnique({
    where: {
      id: userId,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback/?origin=/dashboard");
  }

  try {
    let accountId = dbUser.stripeAccountId;

    // Create a Stripe account for this user if one does not exist already
    if (accountId === undefined || accountId === null) {
      const account = await stripe.accounts.create({
        country: "US",
        email: dbUser.email!,
      });
      accountId = account.id;

      db.member.update({
        where: {
          id: dbUser.id,
        },
        data: {
          stripeAccountId: accountId,
        },
      });
    }

    // Create an account link for the user's Stripe account
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: absoluteUrl("/payments/authorize"),
      return_url: absoluteUrl("/payments/onboarded"),
      type: "account_onboarding",
    });

    // Redirect to Stripe to start the Express onboarding flow
    redirect(accountLink.url);
  } catch (err) {
    console.log("Failed to create a Stripe account.");
    console.log(err);
  }
}
