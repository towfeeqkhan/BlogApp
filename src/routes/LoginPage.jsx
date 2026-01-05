import { SignIn } from "@clerk/clerk-react";

function LoginPage() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <SignIn signUpUrl="/register" />
    </div>
  );
}

export default LoginPage;
