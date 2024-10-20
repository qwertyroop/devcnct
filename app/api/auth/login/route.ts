import { NextResponse } from 'next/server';
import { PortfolioModel } from '@/models/User.model';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/connectDB';

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Find user by email
        const user = await PortfolioModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT token (commented out for now)
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        const username = user.username;
        return NextResponse.json({ username }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
