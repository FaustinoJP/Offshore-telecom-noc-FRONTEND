export const metadata = {
  title: "Offshore Telecom NOC",
  description: "Telecom Network Operations Center",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#0f172a" }}>
        {children}
      </body>
    </html>
  );
}
