import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { parentId: string } }
) {
  try {
    const parentId = params.parentId;

    const posts = await prisma.post.findMany({
      where: {
        parentId: parentId,
      },
      include: {
        replies: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Error fetching posts by parent ID" },
      { status: 500 }
    );
  }
}
