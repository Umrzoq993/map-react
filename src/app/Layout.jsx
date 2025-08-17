import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <Header />
      <main className="content">{children}</main>
    </div>
  );
}
