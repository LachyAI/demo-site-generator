import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" theme="dark" richColors />
    </>
  );
}
