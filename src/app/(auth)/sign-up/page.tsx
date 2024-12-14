"use client";
import { useState, FormEvent, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { CheckUsernameUnique } from "../../../../actions/UsernameAvailable";
import { Signup } from "../../../../actions/Signup";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debouncedSearchTerm = useDebounce(username, 500);
  const router = useRouter();

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedSearchTerm.length === 0) {
        return;
      }
      try {
        const isUsernameAvailable = await CheckUsernameUnique(
          debouncedSearchTerm
        );
        if (isUsernameAvailable.status === false) {
          throw new Error(isUsernameAvailable.msg);
        }
        // console.log(isUsernameAvailable)
        setUsernameMessage(isUsernameAvailable.msg);
      } catch (error: any) {
        setUsernameMessage(error.message);
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsernameUnique();
  }, [debouncedSearchTerm]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", { username, name, password });
    try {
        const res = await Signup({username, name, password});
        if(res.status === false){
            throw new Error(res.msg)
        }
        router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setUsername("");
      setName("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={username}
                  disabled={isCheckingUsername}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameMessage && <div className={`text-sm ${usernameMessage === "Username already exist" ? "text-red-500" : "text-green-500"}`}>{usernameMessage}</div>}
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                disabled={usernameMessage === "Username already exist" ? true : false}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>
          <Link href="/login" className="text-blue-700 flex justify-center pt-3 hover:text-blue-900 hover:cursor-pointer hover:underline">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
}
