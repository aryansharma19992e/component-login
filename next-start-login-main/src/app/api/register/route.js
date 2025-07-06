import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
  const { username, email, password } = await req.json()

  if (!username || !email || !password) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      name: username, // or full name if collected
    },
  })

  return NextResponse.json({ message: 'User created successfully' })
}