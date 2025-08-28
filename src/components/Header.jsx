import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{padding:"1rem", display:"flex", gap:"1rem", background:"#0b0c10"}}>
      <Link to="/" style={{color:"white"}}>Home</Link>
      <Link to="/work" style={{color:"white"}}>Work</Link>
    </header>
  );
}
