import HomeProducts from "./components/HomeProducts";
import CategoriesSection from "./components/CategoriesSection";
import PromotionsSection from "./components/PromotionSection";
import Banner from "./components/Banner";
import DualBanner from "./components/DualBanner";
import CategoriesGrid from "./components/ProductCategories";
import LatestNews from "./components/Articles";

export default function Home() {
  return (
    <div>
      <PromotionsSection/>
      <CategoriesSection/>
      <HomeProducts />
      <DualBanner/>
      <CategoriesGrid/>
      <Banner/>
      <LatestNews/>
    </div>
  );
}
