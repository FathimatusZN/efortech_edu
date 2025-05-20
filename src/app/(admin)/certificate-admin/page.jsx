import { Suspense } from "react";
import CertificateClient from "./CertificateClient";

export default function CertificatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CertificateClient />
        </Suspense>
    );
}
