"use client";

import { useAuth } from "./AuthProvider";
import Link from "next/link";
import { ADMIN_EMAIL } from "@/lib/firebase";

export default function Header() {
  const { user, signIn, logOut } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <header className="border-b border-zinc-200">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight uppercase">
            Codel
          </Link>
          {user && (
            <Link
              href="/history"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              History
            </Link>
          )}
          {user && (
            <Link
              href="/leaderboard"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Leaderboard
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm text-orange-600 hover:text-orange-800 transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-7 h-7 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <button
                onClick={logOut}
                className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="text-sm px-4 py-1.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-700 transition-colors"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
