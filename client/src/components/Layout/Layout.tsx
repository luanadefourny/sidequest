import type { LayoutProps } from "../../types";
import NavBar from "../Navbar/navbar";


export default function Layout ({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      { children }
    </>
  )
}