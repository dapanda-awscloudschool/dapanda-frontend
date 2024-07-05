import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="py-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-orange-500 text-sm mt-24">
      {/* TOP */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-16">
        {/* LEFT Column */}
        <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start gap-2">
          <Link href="/">
            <div className="text-xl font-semibold">
              네고에 지친 당신, Welcome to
            </div>
            <div className="text-5xl text-white font-semibold">DAPANDA🐼</div>
          </Link>
          <div className="text-center lg:text-left mt-2">
            <p className="font-semibold mt-4">
              상호명 및 호스팅 서비스 제공 : DAPANDA
            </p>
            <p>서울특별시 서초구 반포대로24길 17</p>
            <p>Tel: 123-45-67890</p>
            <p>운영시간: 09:00-18:00</p>
            <p>Break Time: 12:30-14:00</p>
          </div>
        </div>

        {/* CENTER Column */}
        <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start gap-2">
          <div className="font-semibold">365고객센터 | 다판다분쟁처리담당</div>
          <div className="text-2xl font-bold">02-1234-5678</div>
          <p>서울특별시 서초구 반포대로24길 17</p>
          <p>email: awscloudschool4th@gmail.com</p>
          <div className="flex gap-4 mt-4">
            <Image
              src="/instagram.png"
              alt="Instagram"
              width={16}
              height={16}
            />
            <Image src="/youtube.png" alt="YouTube" width={16} height={16} />
            <Image
              src="/pinterest.png"
              alt="Pinterest"
              width={16}
              height={16}
            />
            <Image src="/x.png" alt="Twitter" width={16} height={16} />
          </div>
        </div>

        {/* RIGHT Column */}
        <div className="w-full lg:w-1/6 flex flex-col items-center lg:items-start gap-">
          <Image
            src="/cloud_school_logo.png"
            alt="AWS Cloud School Logo"
            width={120}
            height={120}
            className="mt-4"
          />
          <Link href="/with" className="text-medium text-black-500 underline">
            협력사 리스트 바로가기
          </Link>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-8">
        <div className="text-center lg:text-left">@2024 DAPANDA AUCTION</div>
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div>
            <span className="text-black font-bold mr-4">Language</span>
            <span className="font-medium">South Korea | Korean</span>
          </div>
          <div>
            <span className="text-black font-bold mr-4">Currency</span>
            <span className="font-medium">
              ₩ KRW_모든 거래는 원화로 진행됩니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
