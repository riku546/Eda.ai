import { userAuthenticationCheck } from "@/app/actions/userAuthenticationCheck";
import HomePage from "@/components/domain/(authenticated)/home/HomePage";

const Page = async () => {
  await userAuthenticationCheck();

  return <HomePage />;
};

export default Page;
