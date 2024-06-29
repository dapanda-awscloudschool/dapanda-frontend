"use client";

import Link from "next/link";
import Image from "next/image";

const WithPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-16">
      <h1 className="text-3xl font-bold mb-12">AWS Cloud School 4th WITH</h1>
      <div className="flex flex-col gap-8 w-full max-w-4xl">
        <div className="flex flex-row items-center gap-4 bg-white p-4 rounded shadow border">
          <Link href="https://spoid.com">
            <div className="flex flex-row items-center gap-4">
              <Image
                src="/spoid.png" // 대체 이미지 경로 사용
                alt="스포이드"
                width={200}
                height={200}
                className="mb-4"
              />
              <div>
                <h2 className="text-xl font-semibold">스포이드</h2>
                <p className="mt-2 text-gray-600">컴퓨터 사이트 ...</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-4 bg-white p-4 rounded shadow border">
          <Link href="https://interviewmaster.com">
            <div className="flex flex-row items-center gap-4">
              <Image
                src="/interviewmaster.png" // 대체 이미지 경로 사용
                alt="INTERVIEW MASTER"
                width={200}
                height={200}
                className="mb-4"
              />
              <div>
                <h2 className="text-xl font-semibold">INTERVIEW MASTER</h2>
                <p className="mt-2 text-gray-600">취업 사이트 ...</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-4 bg-white p-4 rounded shadow border">
          <Link href="https://dapanda.com">
            <div className="flex flex-row items-center gap-4">
              <Image
                src="/dapanda.png" // 업로드한 이미지를 사용
                alt="DAPANDA"
                width={200}
                height={200}
                className="mb-4"
              />
              <div>
                <h2 className="text-xl font-semibold">DAPANDA</h2>
                <p className="mt-2 text-gray-600">
                  남녀노소 누구나 참여할 수 있는 경매 사이트
                  <br /> 당신도 참여해보세요!
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-4 bg-white p-4 rounded shadow border">
          <Link href="https://quickcatch.com">
            <div className="flex flex-row items-center gap-4">
              <Image
                src="/quickcatch.png" // 대체 이미지 경로 사용
                alt="퀵 캐치"
                width={200}
                height={200}
                className="mb-4"
              />
              <div>
                <h2 className="text-xl font-semibold">퀵 캐치</h2>
                <p className="mt-2 text-gray-600">홈쇼핑 사이트 ...</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-4 bg-white p-4 rounded shadow border">
          <Link href="https://placeholder.com">
            <div className="flex flex-row items-center gap-4">
              <Image
                src="/placeholder.png" // 대체 이미지 경로 사용
                alt="플레이스홀더"
                width={200}
                height={200}
                className="mb-4"
              />
              <div>
                <h2 className="text-xl font-semibold">플레이스홀더</h2>
                <p className="mt-2 text-gray-600">핫플 데이트 앱 ...</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-4 bg-white p-4 rounded shadow border">
          <Link href="https://recipebook.com">
            <div className="flex flex-row items-center gap-4">
              <Image
                src="/mlr.png" // 대체 이미지 경로 사용
                alt="RECIPE BOOK"
                width={200}
                height={200}
                className="mb-4"
              />
              <div>
                <h2 className="text-xl font-semibold">마이리틀 레시피북</h2>
                <p className="mt-2 text-gray-600">레시피 사이트 ...</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WithPage;
