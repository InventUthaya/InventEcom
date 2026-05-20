import TwoStepVerificationForm from "../../components/auth/TwoStepVerificationForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function TwoStepVerification() {
  return (
    <>
      <PageMeta
        title="Two Step Verification | Smart Store"
        description="This is Smart Store Two Step Verification page"
      />
      <AuthLayout>
        <TwoStepVerificationForm />
      </AuthLayout>
    </>
  );
}
