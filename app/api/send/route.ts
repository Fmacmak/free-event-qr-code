// import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { z } from 'zod';


// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file: Blob) => file.size <= 15 * 1024 * 1024, {
      message: 'File size should be less than 15MB',
    })
    // Update the file type based on the kind of files you want to accept
    // .refine((file: Blob) => ['image/png', 'image/jpeg', 'image/heic', 'image/heif'].includes(file.type), {
    //   message: 'File type should be PNG, JPEG, HEIC, or HEIF',
    // }),
});

export async function POST(request: Request) {
  

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(', ');

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get('file') as File).name;
    const fileBuffer = await file.arrayBuffer();

    try {
    //   const data = ""
    //   await put(`${filename}`, fileBuffer, {
    //     access: 'public',
    //   });

    //   return NextResponse.json(data);
      return NextResponse.json({sucess:true})
    } catch (error) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
