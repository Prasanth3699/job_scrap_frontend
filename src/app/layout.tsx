import { Providers } from "@/providers/providers";
import { AuthInitializer } from "@/components/auth/auth-initializer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full">
        <Providers>
          <AuthInitializer>{children}</AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}
