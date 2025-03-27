"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCursor } from "./layout";

function NotFound() {
  const { api } = useCursor();
  const [randomMessage, setRandomMessage] = useState("");

  const pesanApaIniCoeg = [
    "Nani?! Halaman ini tidak ada?! Apakah ini genjutsu dari Itachi?!",
    "404 – Halaman ini menghilang... Mungkin masuk ke Dark Continent?!",
    "Nande?! Halaman ini lenyap! Ataukah ini ulah Dio?! ZA WARUDO!!",
    "Error 404 – Halaman ini tidak ada. Jangan khawatir, kita bisa cari di Grand Line!",
    "Halaman ini seperti angin—terasa ada, tapi tak pernah bisa kugenggam.",
    "404 – Seperti bintang di langit, hanya bisa kupandangi dari jauh.",
    "404 – Divergensi dunia ini tidak memungkinkan halaman ini untuk ditemukan.",
    "Halaman ini hilang… Atau mungkin hanya ada di worldline lain.",
    "404 – Halaman ini tidak ditemukan... Mungkin sudah menjadi bagian dari 'kutukan'.",
    "Kau mencarinya? Hati-hati… beberapa hal lebih baik dibiarkan tidak ditemukan.",
    "Halaman ini tidak ada... Atau mungkin dia sudah 'dihapus' dari realitas.",
    "Realitas terus bergerak, dunia terus berputar… tapi halaman ini tetap tidak ditemukan.",
    "404 – Apakah ini konsekuensi dari memilih jalan yang salah? Jika saja aku bisa kembali ke awal dan memilih berbeda...",
    "E=mc², tekanan atmosfer, hukum termodinamika… Semua bisa dijelaskan dengan sains! Tapi halaman ini? 10 miliar persen tetap tidak ditemukan!",
    "404 – Seperti kasus yang belum terpecahkan, halaman ini masih menjadi misteri.",
    "cape le mikirin pesan error 404"
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * pesanApaIniCoeg.length);
    setRandomMessage(pesanApaIniCoeg[randomIndex]);
  }, []);

  return (
    <div className="w-screen md:h-screen h-[90vh] overflow-hidden flex flex-col justify-center items-center text-center px-4 cursor-none">
      {/* Animasi 404 */}
      <motion.h1
        className="text-6xl md:text-8xl font-bold text-yellow-300 mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 150 }}
        onMouseEnter={() => api.start({ scale: 3, rounded: 0 })}
        onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}
      >
        404
      </motion.h1>

      {/* Animasi Pesan Error */}
      <motion.div
        className="text-xl md:text-2xl text-zinc-400 max-w-xl mb-8 italic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => api.start({ scale: 1.5, rounded: 10 })}
        onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}
      >
        {randomMessage}
      </motion.div>

      {/* Animasi Footer */}
      <motion.div
        className="absolute bottom-8 text-sm text-zinc-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        *yaampun*
      </motion.div>
    </div>
  );
}

export default NotFound;
