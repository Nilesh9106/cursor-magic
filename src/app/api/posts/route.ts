import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const post = await prisma.post.create({
      data: {
        content: json.content,
        parentId: json.parentId || null,
      },
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        parentId: null,
      },
      include: {
        replies: true,
      },
    });

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
