import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'File uploads are disabled in production.' },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Read the file as a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Define a simple, consistent name for the avatar
    // This will overwrite the existing file, which is fine for a profile pic
    const filename = 'profile-pic.jpg'; // You can use file.name for unique names

    // Define the path to the /public folder
    const publicPath = path.join(process.cwd(), 'public');
    const savePath = path.join(publicPath, filename);

    // Write the file to the public directory
    fs.writeFileSync(savePath, buffer);

    // Return the public-facing path to the image
    const publicUrl = `/${filename}`; // This is the URL the website will use (e.g., /profile-pic.jpg)

    return NextResponse.json({ success: true, path: publicUrl });
  } catch (error) {
    console.error(error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to save image: ${errorMessage}` },
      { status: 500 }
    );
  }
}