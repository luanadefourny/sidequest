import type { LayoutProps } from "../../types";
import NavBar from "../Navbar/Navbar";


export default function Layout ({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      { children }
    </>
  )
}