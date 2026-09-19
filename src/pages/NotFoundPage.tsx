import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-heading text-3xl font-bold text-[#1C1C1A]">404</p>
      <p className="mt-1 font-body text-sm text-[#6B7280]">That page doesn't exist.</p>
      <Link to="/dashboard" className="mt-5">
        <Button variant="primary">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
