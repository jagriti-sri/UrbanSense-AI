import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import VoiceFab from './VoiceFab';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <VoiceFab />
      <Footer />
    </>
  );
}
