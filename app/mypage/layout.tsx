export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col px-4 pt-20">
      <h1 className="mb-6 text-xl font-semibold">마이페이지</h1>
      {children}
    </div>
  );
}
