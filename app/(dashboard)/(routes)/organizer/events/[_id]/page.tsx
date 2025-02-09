import event from '@/lib/models/events';
import { categories } from '@/lib/models/categories';

import React from 'react';
import { LayoutDashboard } from 'lucide-react';

import { redirect } from 'next/navigation';

import { IconBadge } from '@/components/icon-badge';
import { TitleForm } from '@/components/events/title-form';
import { DescriptionForm } from '@/components/events/description-form';
import { TimeForm } from '@/components/events/time-form';
import { Banner } from '@/components/banner';
import { EventActions } from '@/components/events/event-actions';
import { CategoryForm } from '@/components/events/categories-form';

const EventIdPage = async ({ params }: { params: { _id: string } }) => {
    const awaitedParams = await params;
    
    // const cookieStore = await cookies();
    // const token = cookieStore.get('token')?.value;
    
    // const User = await user.findOne({ token: token });
    
    const Event = await event.findOne({ _id: awaitedParams._id });

    if(!Event)
        return redirect("/");

    // if(Event.email !== User.email)
    //     return redirect("/");

    const requiredFields = [ Event.title, Event.description, Event.time, Event.categoryId ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!Event.isPublished && (
                <Banner label="This event is not published. It will not be visible to the attendees." />
            )}
            <div className='p-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-y-2'>
                        <h1 className='text-2xl font-medium'>
                            Event setup
                        </h1>
                        <span className='text-sm text-slate-700'>
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <EventActions disabled={!isComplete} eventId={awaitedParams._id} isPublished={Event.isPublished} />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className='text-xl'>
                                Customize your event
                            </h2>
                        </div>
                        <TitleForm initialData={{ title: Event.title }} eventId={ awaitedParams._id } />
                        <DescriptionForm initialData={{ description: Event.description }} eventId={ awaitedParams._id } />
                        <TimeForm initialData={{ time: Event.time }} eventId={ awaitedParams._id } />
                        <CategoryForm initialData={{ categoryId: Event.categoryId }} eventId={ awaitedParams._id } options={categories.map((category) => {
                            return {
                                label: category.name,
                                value: category.id.toLocaleString()
                            }
                        })} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventIdPage;