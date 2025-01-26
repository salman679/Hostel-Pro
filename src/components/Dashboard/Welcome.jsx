import { useAuth } from "../../contexts/AuthContext";

export default function Welcome() {
  const { user } = useAuth();
  return (
    <div className="text-center h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold -mt-96">Hi {user.displayName}!</h1>
      <p className="text-4xl mt-4">Welcome to Hostel Pro Dashboard.</p>
    </div>
  );
}
