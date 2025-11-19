'use client';
import {useUser} from "@stackframe/stack";

export default function Home() {
    const user = useUser();
    console.log(user);

    return (
    <div className="flex items-center justify-center text-white font-sans">
       Hello, {user ? user.displayName : 'Guest'}!
    </div>
  );
}
