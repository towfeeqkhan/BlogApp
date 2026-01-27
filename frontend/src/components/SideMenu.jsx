import { Link, useSearchParams } from "react-router";
import Search from "./Search";

function SideMenu() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        sort: e.target.value,
      });
    }
  };

  const sort = searchParams.get("sort") || "";

  return (
    <div className="px-4 h-max sticky top-8">
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />
      <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="newest"
            onChange={handleFilterChange}
            checked={sort === "newest" || sort === ""}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800 dark:bg-gray-800"
          />
          Newest
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="popular"
            onChange={handleFilterChange}
            checked={sort === "popular"}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800 dark:bg-gray-800"
          />
          Most Popular
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="trending"
            onChange={handleFilterChange}
            checked={sort === "trending"}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800 dark:bg-gray-800"
          />
          Trending
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="oldest"
            onChange={handleFilterChange}
            checked={sort === "oldest"}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800 dark:bg-gray-800"
          />
          Oldest
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
      <div className="flex flex-col gap-2 text-sm">
        <Link className="underline cursor-pointer" to="/posts">
          All
        </Link>
        <Link className="underline cursor-pointer" to="/posts?cat=web-design">
          Web Design
        </Link>
        <Link className="underline cursor-pointer" to="/posts?cat=development">
          Development
        </Link>
        <Link className="underline cursor-pointer" to="/posts?cat=databases">
          Databases
        </Link>
        <Link className="underline cursor-pointer" to="/posts?cat=seo">
          Search Engines
        </Link>
        <Link className="underline cursor-pointer" to="/posts?cat=marketing">
          Marketing
        </Link>
      </div>
    </div>
  );
}

export default SideMenu;
