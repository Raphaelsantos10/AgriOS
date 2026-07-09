import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8">
      <div className="flex gap-6 items-center">
        <Bell />
        <UserCircle size={34} />
      </div>
    </header>
  );
}