import { columns } from "@/components/events/columns";
import { DataTable } from "@/components/events/data-table";

import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";

const EventsPage = async () => {
    await connectToDB();
    let data;
    try {
        const rawData = await event.find().sort({ time: 1 }).lean().exec();
        data = rawData.map(({ _id, title, description, time, isPublished }) => {
            return (
                { id: _id.toString(), title: title, description: description, isPublished: isPublished, startDate: time }
            )
        });
    } catch (error) {
        console.error(error)
    }

    return (
        <div className="p-6">
            <DataTable columns={columns} data={data || []} />
        </div>
    )
}

export default EventsPage