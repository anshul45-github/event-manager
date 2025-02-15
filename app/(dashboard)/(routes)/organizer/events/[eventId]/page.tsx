import { DescriptionForm } from "@/components/events/description-form";
import { ImageForm } from "@/components/events/image-form";
import { TitleForm } from "@/components/events/title-form";
import { IconBadge } from "@/components/icon-badge";

import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";

import { auth } from "@clerk/nextjs/server";

import { LayoutDashboard } from "lucide-react";
import { ExplainVerbosity } from "mongodb";

import { redirect } from "next/navigation";

const EventIdPage = async ({ params }: { params: { eventId: string } }) => {
    await connectToDB();

    const { userId } = await auth();

    if(!userId)
        return redirect("/");

    const Event = await event.findOne({ id: (await params).eventId });

    if(!Event)
        return redirect("/");

    const requiredFields = [Event.name, Event.description, Event.imageUrl, Event.fee, Event.time, Event.categoryId, Event.location];

    const totalField = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalField})`;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Event setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Customize your event
                        </h2>
                    </div>
                    <TitleForm initialData={{ name: Event.name }} eventId={ (await params).eventId } />
                    <DescriptionForm initialData={{ description: Event.description }} eventId={ (await params).eventId } />
                    <ImageForm initialData={{ imageUrl: Event.imageUrl }} eventId={ (await params).eventId } />
                </div>
            </div>
        </div>
    )
}

export default EventIdPage;