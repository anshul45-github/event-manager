import event from '@/lib/models/events';
import user from '@/lib/models/userModel';

import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { LayoutDashboard } from 'lucide-react';

const EventIdPage = async ({ params }: { params: { _id: string } }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    const User = await user.findOne({ token: token });
    
    const Event = await event.findOne({ _id: params._id });

    if(!Event)
        return redirect("/");

    if(Event.email !== User.email)
        return redirect("/");

    const requiredFields = [ Event.title, Event.description, Event.imageUrl, Event.time ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    return (
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
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className='text-xl'>
                            Customize your event
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventIdPage;