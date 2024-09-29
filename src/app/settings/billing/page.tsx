// import BillingForm from '@/components/BillingForm';
import { currentUser } from '@clerk/nextjs/server';

const Page = async () => {
  const user = await currentUser();
  const userId = user?.id;

  // return <BillingForm subscriptionPlan={subscriptionPlan} userId={!!userId} />;
};

export default Page;
