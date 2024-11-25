
import Image from "next/image";

const AdvertisingBannerWithImage = () => {
    return (
      <div className="w-100 h-20 bg-gray-100 flex items-center justify-center shadow-lg px-1">
        <Image
          src="https://i.pinimg.com/originals/3a/05/df/3a05df263c9c8d7f6f2971fbf4ab8068.gif" // Remplacez par votre URL publicitaire
          alt="Bannière publicitaire"
          width={5}
          height={500}
          className="h-2 w-full"
        />
      </div>
    );
  };
  
  export default AdvertisingBannerWithImage;
  