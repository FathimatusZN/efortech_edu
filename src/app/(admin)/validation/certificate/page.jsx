import { Suspense } from "react";
import ValidationCertificateClient from "./ValidationCertificateClient";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ValidationCertificatePage() {
  return (
    <Suspense fallback={<div className="items-center justify-center"><LoadingSpinner /></div>}>
      <ValidationCertificateClient />
    </Suspense>
  );
}
