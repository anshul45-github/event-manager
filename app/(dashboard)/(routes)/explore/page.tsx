import { Categories } from "@/components/explore/categories"
import { SearchInput } from "@/components/search-input"

const ExplorePage = () => {
    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6">
                <Categories />
            </div>
        </>
    )
}

export default ExplorePage