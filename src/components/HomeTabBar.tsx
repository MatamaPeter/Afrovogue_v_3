import Link from "next/link";
import { productType } from "../../constants/data";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 w-full">
      {/* Tab Buttons with See All overlay on mobile */}
      <div className="relative w-full md:w-auto flex-1">
        <div
          className="
            flex items-center gap-2 md:gap-3 text-sm font-medium 
            overflow-x-auto md:overflow-visible no-scrollbar
            w-full pr-20
          "
        >
          {productType.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`
                shrink-0 rounded-full px-5 py-2 transition-colors duration-200 ease-in-out
                ${
                  selectedTab === item?.title
                    ? "bg-kitenge-red/90 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {item?.title}
            </button>
          ))}
        </div>

        {/* See All button (sticks on right in mobile, normal in desktop) */}
        <div className="absolute right-0 top-0 h-full hidden md:flex items-center pl-4 bg-gradient-to-l from-white/80 to-transparent">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 ease-in-out group bg-white rounded-full shadow-sm"
          >
            See all
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.295a.75.75 0 111.04-1.09l5.25 5a.75.75 0 010 1.09l-5.25 5a.75.75 0 11-1.04-1.09l4.158-3.955H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* Mobile version of See all (sticky overlay) */}
        <div className="absolute right-0 top-0 h-full flex md:hidden items-center pl-4 bg-gradient-to-l from-white/80 to-transparent">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-kitenge-red hover:text-slate-900 transition-colors duration-200 ease-in-out group bg-kitenge-red/10 rounded-full backdrop-blur-md shadow-sm"
          >
            See all
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.295a.75.75 0 111.04-1.09l5.25 5a.75.75 0 010 1.09l-5.25 5a.75.75 0 11-1.04-1.09l4.158-3.955H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeTabBar;
