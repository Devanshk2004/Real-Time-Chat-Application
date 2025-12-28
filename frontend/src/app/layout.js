import "./globals.css"; 
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  title: "Chat App",
  description: "Real-time chat application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* We wrap everything in ClientLayout to handle Auth & Theme */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}