import { categories } from "@/lib/models/categories"
import { CategoryItem } from "./category-item"

export const Categories = () => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
                <CategoryItem key={category.id} label={category.name} value={category.id.toLocaleString()} />
            ))}
        </div>
    )
}