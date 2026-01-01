export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col px-4 pt-20">
      <h1 className="mb-6 text-2xl font-bold">즐겨찾기 목록</h1>
      {children}
    </div>
  );
}
