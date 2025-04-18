import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
     try {
          const formData = await request.formData();
          const file = formData.get('image') as File;

          if (!file) {
               return NextResponse.json(
                    { error: 'No file uploaded' },
                    { status: 400 }
               );
          }

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Generate a unique filename
          const filename = `quote-${Date.now()}.png`;
          const path = join(process.cwd(), 'public', 'uploads', filename);

          // Save the file
          await writeFile(path, buffer);

          // Return the URL of the uploaded file
          const imageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/uploads/${filename}`;

          return NextResponse.json({ imageUrl });
     } catch (error) {
          console.error('Error uploading file:', error);
          return NextResponse.json(
               { error: 'Error uploading file' },
               { status: 500 }
          );
     }
} 