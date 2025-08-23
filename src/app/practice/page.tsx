import Link from "next/link";

const practices = [
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

export default function PracticeMenu() {
  return (
    <div className="p-10 grid gap-4 sm:grid-cols-2">
      {practices.map((p) => (
        <Link
          key={p.href}
          href={p.href}
          className="block p-4 border rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="font-bold">{p.title}</div>
          <p className="text-sm text-gray-600">{p.description}</p>
        </Link>
      ))}
    </div>
  );
}

