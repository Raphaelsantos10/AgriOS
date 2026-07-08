import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white shadow flex items-center justify-between px-8">

      <h2 className="text-2xl font-bold">

        Centro de Operações

      </h2>

      <div className="flex gap-6 items-center">

        <Bell />

        <UserCircle size={34} />

      </div>

    </header>
  );
}