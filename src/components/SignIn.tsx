import { SignInButton } from "@clerk/nextjs";

const SignIn = () => {
  return (
    <SignInButton
      mode="modal"
      appearance={{
        variables: {
          colorPrimary: "#E04F54",
          fontFamily: "sans-serif",
        },
      }}
      
    >
      <button
        className="px-6 py-3 text-sm font-semibold rounded-xl text-white transition-all duration-300 ease-in-out transform
        bg-gradient-to-r from-kitenge-red to-kitenge-red/80
        hover:from-kitenge-red/90 hover:to-kitenge-red
        "
      >
        Login
      </button>
    </SignInButton>
  );
};

export default SignIn;
