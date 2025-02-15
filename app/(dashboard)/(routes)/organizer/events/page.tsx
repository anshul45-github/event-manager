import { columns } from "@/components/events/columns";
import { DataTable } from "@/components/events/data-table";

import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";

interface EventItem {
    title: string;
    time: Date;
    isPublished: boolean;
    description: string;
}

const EventsPage = async () => {
    await connectToDB();
    let data: { title: string; description: string; startDate: Date; isPublished: boolean }[] = [];
    try {
        const rawData = await event.find().sort({ time: 1 }).lean().exec() as unknown as EventItem[];
        data = rawData.map((item: EventItem) => ({ title: item.title, description: item.description, isPublished: item.isPublished, startDate: item.time }));
    }
    catch (error) {
        console.error(error)
    }

    return (
        <div className="p-6">
            Events Page
        </div>
    )
}

export default EventsPage