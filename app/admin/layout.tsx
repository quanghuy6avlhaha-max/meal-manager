import Menu from "../components/Menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      <Menu />

      <div className="p-4">
        {children}
      </div>
    </main>
  );
}