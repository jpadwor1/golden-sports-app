import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function POST(request: Request, response: Response) {
  const body = await request.json();

  const { stripeAccountId } = body;
  try {
    if (!stripeAccountId) {
      return new Response("ID is required.", { status: 400 });
    }

    try {
      const account = await stripe.accounts.retrieve(stripeAccountId);

      if (!account.details_submitted) {
        // Create an account link for the user's Stripe account
        const accountLink = await stripe.accountLinks.create({
          account: stripeAccountId,
          refresh_url: absoluteUrl("/payments/authorize"),
          return_url: absoluteUrl("/payments/onboarded"),
          type: "account_onboarding",
        });

        return new Response(accountLink.url, { status: 200 });
      } else {
        const user = await db.member.findFirst({
          where: {
            stripeAccountId: stripeAccountId,
          },
        });

        if (!user) {
          return new Response("User not found.", { status: 404 });
        }

        await db.member.update({
          where: {
            id: user.id,
          },
          data: {
            stripeAccountComplete: true,
          },
        });
        return new Response("Account is verified.", { status: 200 });
      }
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
