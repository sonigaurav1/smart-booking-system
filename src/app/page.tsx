import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center pt-20 w-full items-center">
        <h1 className="text-4xl font-bold">
          Smart Booking System
        </h1>

        <Image
          className="h-[300px] w-auto mt-10"
          src="/booking.png"
          alt="Booking System Logo"
          width={100}
          height={100}
          priority
        />
      </div>
    </>
  );
}
