import { NotificationProvider } from "@/components/notifications/notification-provider"
// ... other imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
