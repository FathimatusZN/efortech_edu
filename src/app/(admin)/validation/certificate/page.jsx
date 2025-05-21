import { Suspense } from "react";
import ValidationCertificateClient from "./ValidationCertificateClient";

export default function ValidationCertificatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ValidationCertificateClient />
    </Suspense>
  );
}
