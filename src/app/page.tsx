import HomeProducts from "./components/HomeProducts";
// import CategoriesSection from "./components/CategoriesSection";
// import PromotionsSection from "./components/PromotionSection";
import Banner from "./components/Banner";
import DualBanner from "./components/DualBanner";
import CategoriesGrid from "./components/ProductCategories";
import LatestNews from "./components/Articles";
import BenefitsSection from "./components/BenefitsSection";
import ProductSlider from "./components/ProductSlider";
import NavigationBar from "./components/NavBar";
// import AdvertisingBannerWithImage from "./components/publicite/page";


export default function Home() {
  return (
    <div>
      <NavigationBar/>
      <ProductSlider/>
      {/* <AdvertisingBannerWithImage/> */}
      <BenefitsSection/>
      {/* <PromotionsSection/> */}
      {/* <CategoriesSection/> */}
      <HomeProducts />
      <DualBanner/>
      <CategoriesGrid/>
      <Banner/>
      <LatestNews/>
    </div>
  );
}
