import { getSession, signIn } from 'next-auth/client';
import Link from 'next/link';

const LoginButton = ({ session }) => {
  if (session) {
    return false;
  }

  // const handleSignIn = e => {
  //   e.preventDefault();
  //   signIn();
  // };

  return (
    <div>
      <Link href="/login">
        <button className="border border-gray-600 px-2 py-1 rounded bg-white hover:bg-gray-300">Sign In</button>
      </Link>
    </div>
  );
};


export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  return {
    props: {
      session,
    },
  };
};

export default LoginButton;
