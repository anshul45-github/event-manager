import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
    const { userId } = await auth();
    if(!userId)
        throw new UploadThingError("Unauthorized");
    return { userId };
}

export const ourFileRouter = {
  eventImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }})
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  brochure: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 }})
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
