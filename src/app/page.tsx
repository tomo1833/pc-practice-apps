import Link from "next/link";

const menus = [
  {
    href: "/practice/click-challenge",
    title: "10秒クリックチャレンジ",
    description: "10秒間でできるだけクリックしよう",
  },
  {
    href: "/practice/double-click",
    title: "ダブルクリック練習",
    description: "設定時間内に素早く2回クリックしよう",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">練習メニュー</h1>
      <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-2">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className="flex flex-col justify-between p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{menu.title}</h2>
              <p className="text-gray-600 text-sm">{menu.description}</p>
            </div>
            <span className="mt-4 text-blue-600 text-sm font-medium">開始する →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

