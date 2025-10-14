import { PulseLogo } from "@/components/ui/PulseLogo";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="scale-125">
        <PulseLogo size="lg" />
      </div>
    </div>
  );
}


