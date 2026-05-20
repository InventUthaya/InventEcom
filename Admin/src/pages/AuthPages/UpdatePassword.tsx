import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import UpdatePasswordForm from "../../components/auth/UpdatePasswordForm";

export default function UpdatePassword() {
  return (
    <>
      <PageMeta
        title="Update Password | Smart Store"
        description="This is Smart Store Update Password page"
      />
      <AuthLayout>
        <UpdatePasswordForm />
      </AuthLayout>
    </>
  );
}
