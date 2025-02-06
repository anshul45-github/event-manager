import { Button } from "@/components/ui/button"
import Link from "next/link"

const EventsPage = () => {
    return (
        <div className="p-6">
            <Link href={"/organizer/create"}>
                <Button>
                    New Event
                </Button>
            </Link>
        </div>
    )
}

export default EventsPage