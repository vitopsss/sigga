import { Sidebar } from "@/components/dashboard/sidebar";
import { getCurrentSiggaterUser } from "@/lib/auth/current-user";

export default async function AterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentSiggaterUser();

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar scope="siggater" user={user} />
      <main className="flex-1 ml-64 transition-[margin] duration-300 peer-data-[collapsed=true]:ml-20">
        {children}
      </main>
    </div>
  );
}
