import ConfirmClient from "@/components/ConfirmClient";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">
        ⚡ Click Speed Test
      </h1>
      <ConfirmClient />
    </main>
  );
}
