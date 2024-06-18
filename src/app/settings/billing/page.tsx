// import BillingForm from '@/components/BillingForm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user?.id;

  // return <BillingForm subscriptionPlan={subscriptionPlan} userId={!!userId} />;
};

export default Page;
