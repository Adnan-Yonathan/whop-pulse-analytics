import { PulseLogo } from "@/components/ui/PulseLogo";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#000' }}>
      <div className="scale-125">
        <PulseLogo size="lg" />
      </div>
    </div>
  );
}


