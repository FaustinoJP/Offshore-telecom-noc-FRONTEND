export const metadata = {
  title: "Offshore Telecom NOC",
  description: "Telecom Network Operations Center",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
