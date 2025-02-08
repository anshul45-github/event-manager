import React from 'react';

const EventIdPage = ({ params }: { params: { _id: string } }) => {
    return (
        <div>
            Course ID : {params._id}
        </div>
    )
}

export default EventIdPage;