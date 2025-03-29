import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: 'Semua field harus diisi' }, 
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: `Pesan Baru dari Portfolio - ${name}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #333;">
        <h2 style="color: #facc15; text-align: center;">Pesan Baru dari Formulir Contact</h2>
        <div style="color: white">
        <p style="margin-bottom: 10px;"><strong>Nama:</strong> ${name}</p>
        <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
        <p style="margin-bottom: 10px;"><strong>Pesan:</strong></p>
        </div>
        <p style="background-color: #333; padding: 10px; border-radius: 5px;">${message}</p>
        <p style="margin-top: 20px; text-align: center; font-size: 0.9em; color: #888;">Dikirim pada: ${formattedDate}</p>
      </div>
      `
    });

    return NextResponse.json(
      { message: 'Pesan berhasil dikirim' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Kesalahan pengiriman email:', error);
    return NextResponse.json(
      { message: 'Gagal mengirim pesan' }, 
      { status: 500 }
    );
  }
}