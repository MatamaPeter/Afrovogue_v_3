import  {Toaster} from 'react-hot-toast'
const RootLayout=({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    return (
      <html lang="en">
        <body className="font-poppins antialiased">
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#E11218",
                color:"#fff",
              },
            }}
          />
        </body>
      </html>
    );
}

export default RootLayout;