import { Categories } from "@/components/explore/categories";
import { EventList } from "@/components/explore/events-list";
import { SearchInput } from "@/components/search-input";
import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";
import { Suspense } from "react";

interface SearchParamsProps {
    title?: string;
    categoryId?: string;
}

interface ExplorePageProps {
    searchParams: Promise<SearchParamsProps>;
}

interface EventItem {
    _id: string;
    title: string;
    imageUrl?: string;
    categoryId: string;
    time: Date;
}

const ExplorePage = async ({ searchParams }: ExplorePageProps) => {
    const awaitedSearchParams = await searchParams;
    const body = {
        title: awaitedSearchParams.title || "",
        categoryId: awaitedSearchParams.categoryId || "",
    };

    await connectToDB();

    let data: { id: string; title: string; imageUrl: string; categoryId: string; time: Date }[] = [];
    try {
        const rawData = await event
            .find({
                categoryId: body.categoryId,
                title: { $regex: body.title, $options: "i" },
                isPublished: true,
            })
            .sort({ time: 1 })
            .lean()
            .exec() as unknown as EventItem[];

        data = rawData.map((item: EventItem) => ({
            id: item._id.toString(),
            title: item.title,
            imageUrl: item.imageUrl || "",
            categoryId: item.categoryId,
            time: item.time,
        }));
    } catch (error) {
        console.error(error);
    }

    return (
            <>
            <Suspense>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6">
                <Categories />
                <div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                        {data.map(({ id, title, imageUrl, categoryId, time }) => (
                            <EventList key={id} id={id} name={title} imageUrl={imageUrl} category={categoryId} time={time} />
                        ))}
                    </div>
                    {data.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground mt-10">
                            No events found
                        </div>
                    )}
                </div>
            </div>
            </Suspense>
        </>
    );
};

export default ExplorePage;
