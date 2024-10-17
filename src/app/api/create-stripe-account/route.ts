import { db } from "@/db";
import { createStripeAccount, stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function POST(request: Request, response: Response) {
  const body = await request.json();

  const { userId } = body;
  console.log("API userId:", userId);
  try {
    if (!userId) {
      return new Response("User ID is required.", { status: 400 });
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
      console.log("accountId:", accountId);
      // Create a Stripe account for this user if one does not exist already
      if (accountId === null) {
        const account = await stripe.accounts.create({
          type: "standard",
          country: "US",
          email: dbUser.email as string,
        });
        accountId = account.id;
        await db.member.update({
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

      return new Response(accountLink.url, { status: 200 });
    } catch (err: any) {
      console.log("Failed to create a Stripe account.");
      console.log(err);
      return new Response(err, { status: 500 });
    }
  } catch (err: any) {
    console.log("Failed to create a Stripe account.");
    console.log(err);
    return new Response(err, { status: 500 });
  }
}
