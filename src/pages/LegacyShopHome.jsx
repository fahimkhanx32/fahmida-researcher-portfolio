// Previous e-commerce home page, preserved unchanged and served at /legacy-shop.
import Header from '../components/Header/Header.jsx';
import Navbar from '../components/Navbar/Navbar.jsx';
import Banner from '../components/Banner/Banner.jsx';
import Slider from '../components/Slider/Slider.jsx';
import Smallcards from '../components/Smallcards/Smallcards.jsx';
import ProductCards from '../components/ProductCards/ProductCards.jsx';

export default function LegacyShopHome() {
  return (
    <>
      <Header />
      <Navbar />
      <Banner />
      <Slider />
      <Smallcards />
      <ProductCards />
    </>
  );
}
