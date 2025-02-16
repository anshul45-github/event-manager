import { DescriptionForm } from "@/components/events/description-form";
import { ImageForm } from "@/components/events/image-form";
import { TitleForm } from "@/components/events/title-form";
import { IconBadge } from "@/components/icon-badge";

import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";

import { auth } from "@clerk/nextjs/server";

import { CircleDollarSign, File, LayoutDashboard, ListCheck } from "lucide-react";

import { redirect } from "next/navigation";
import { CategoryForm } from "../../../../../../components/events/categories-form";
import { categories } from "@/lib/models/categories";
import { PriceForm } from "@/components/events/price-form";
import { BrochureForm } from "@/components/events/brochure-form";
import { TimeForm } from "@/components/events/time-form";
import { VenueForm } from "@/components/events/venue-form";

const EventIdPage = async ({ params }: { params: { eventId: string } }) => {
    await connectToDB();

    const { userId } = await auth();

    if(!userId)
        return redirect("/");

    const Event = await event.findOne({ id: (await params).eventId });

    if(!Event)
        return redirect("/");

    const requiredFields = [Event.name, Event.description, Event.imageUrl, Event.fee, Event.time, Event.categoryId, Event.venue];

    const totalField = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalField})`;

    const options = categories.map((category: any) => ({
        value: category.id,
        label: category.name,
    }));

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
                    <CategoryForm initialData={{ categoryId: Event.categoryId }} eventId={ (await params).eventId } options={options} />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListCheck} />
                            <h2 className="text-xl">
                                Event details
                            </h2>
                        </div>
                        <TimeForm initialData={{ time: Event.time }} eventId={ (await params).eventId } />
                        <VenueForm initialData={{ venue: Event.venue, city: Event.city, state: Event.state }} eventId={ (await params).eventId } />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl">
                                Pricing
                            </h2>
                        </div>
                        <PriceForm initialData={{ fee: Event.fee }} eventId={ (await params).eventId } />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl">
                                Brochure
                            </h2>
                        </div>
                        <BrochureForm initialData={{ brochureUrl: Event.brochureUrl }} eventId={ (await params).eventId } />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventIdPage;