// app/api/users/[username]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDB';
import { PortfolioModel } from '@/models/User.model';

export async function PUT(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();
    const { username } = params;
    const body = await request.json();

    const updatedUser = await PortfolioModel.findOneAndUpdate(
      { username },
      { $set: body },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Error updating user' },
      { status: 500 }
    );
  }
}