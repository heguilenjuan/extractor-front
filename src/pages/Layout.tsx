import NavBar from "../components/NavBar"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <main className="p-5">
        {children}
      </main>
    </>
  )
}

export default Layout