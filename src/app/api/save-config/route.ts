import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  // A check to ensure this API is not accidentally used in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'File writing is disabled in production.' },
      { status: 403 }
    );
  }

  try {
    // 1. Get the new config data from the form's request
    const newConfig = await req.json();

    // 2. Define the path to portfolio-config.json in your project's root
    // process.cwd() gives the root directory of your Next.js project
    const configPath = path.join(process.cwd(), 'portfolio-config.json');

    // 3. Write the file
    // We use JSON.stringify(data, null, 2) to make the saved JSON file human-readable
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');

    // 4. Send a success response
    return NextResponse.json({ success: true, message: 'Config saved locally.' });
  } catch (error) {
    console.error(error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to save config: ${errorMessage}` },
      { status: 500 }
    );
  }
}